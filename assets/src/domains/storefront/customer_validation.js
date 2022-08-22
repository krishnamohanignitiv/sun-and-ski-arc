/* eslint-disable max-len */
// const request = require('requests');
// const fetch1 = require('node-fetch');
// const url = require('url');
const superagent = require('superagent');
const Client = require('mozu-node-sdk/clients/platform/application');
const B2bAccountSDK = require('../../../resources/b2bAccount');
const B2BAccount = require('../../utilities/b2bAccountCreationPipeline');

const B2bAccountCreate = new B2BAccount();
module.exports = function (context) {
  // eslint-disable-next-line prefer-object-spread
  const payload = Object.assign({}, context.request.body);
  console.log('payload received', payload);
  const client = new Client({
    context: {
      appKey: 'CosCon.coastal_registration_QA.1.0.0.Release',
      sharedSecret: '56159cf5e5d94df6a0060ec42238af85',
    },
  });

  const tempClient = new Client();

  client.context['user-claims'] = null;
  const b2bAccount = new B2bAccountSDK(client);
  let p21AccountId;
  let Industry;
  let Size;
  let kiboRegion;

  const requiredData = {};
  /**
   * All async functions
   */
  async function customerValidate() {
    return superagent
      .get(
        `https://api.simpleapps.net/ecommerce/customers/${payload.accountNumber}`
      )
      .query({ resource_list: 'all', siteid: 'coastalone' })
      .set('x-api-key', '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0')
      .then(res => {
        console.log('SimpleApps Customer API Working');
        Object.assign(res, JSON.parse(res.text));
        return {
          accountId: res.data.customer_id,
          industry: res.data.class_1id,
          size: res.data.class_3id,
          kibo_region: res.data.resources.customersControl[0].source_location_id,
          companyOrOrganization: res.data.customer_name,
          address1: res.data.resources.customersBilltos[0].phys_address1,
          address2: res.data.resources.customersBilltos[0].phys_address2,
          cityOrTown: res.data.resources.customersBilltos[0].phys_city,
          stateOrProvince: res.data.resources.customersBilltos[0].phys_state,
          postalOrZipCode: res.data.resources.customersBilltos[0].phys_postal_code,
          countryCode: res.data.resources.customersBilltos[0].phys_country
        };
      })
      .catch(err => {
        console.log('SimpleApps Customer API error');
        console.log(err);
        throw new Error('SimpleApps Customer API error');
      });
  }
  async function invoiceValidate() {
    return superagent
      .get(
        `https://api.simpleapps.net/ecommerce/invoices?resource_list=all&customer_id=${payload.accountNumber}`
      )
      .query({
        resource_list: 'all',
        siteid: 'coastalone',
        customer_id: payload.accountNumber,
        limit: 5,
      })
      .set('x-api-key', '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0')
      .then(res => {
        console.log('SimpleApps Invoice Api Working');
        Object.assign(res, JSON.parse(res.text));
        return res.data.map(invoice => invoice.total_amount);
      })
      .catch(err => {
        console.log('SimpleApps Invoice API Error');
        console.log(err);
        throw new Error('SimpleApps Invoice API Error');
      });
  }

  async function validateExistingAccount(accountNumber) {
    return b2bAccount.getB2BAccounts({
      filter: `attributes.value eq ${accountNumber}`,
    });
  }

  /**
   * Validate custom attribute before customerValidate
   */
  validateExistingAccount(payload.accountNumber)
    .then(
      res => new Promise((resolve, reject) => {
        if (res.totalCount === 0) {
          resolve('Account does not exist');
        }
        reject(new Error('Account is already registered'));
      })
    )
    .then(() => Promise.all([customerValidate(), invoiceValidate()]))
    .then(res => {
      res.forEach(validationItem => {
        if (Array.isArray(validationItem)) {
          requiredData.invoices = validationItem;
        } else {
          Object.assign(requiredData, validationItem);
        }
      });
      if (requiredData.accountId !== payload.accountNumber || requiredData.postalOrZipCode !== payload.billingZip) {
        throw new Error('Account not validated for Customer Account');
      }
      return new Promise((resolve, reject) => {
        const validateAmount = requiredData.invoices.findIndex(
          element => Number(element) === Number(payload.lastInvoice)
        );
        console.log(validateAmount);
        if (validateAmount >= 0) resolve();
        reject(new Error('Account not validated for invoice amount'));
      });
    })
    .then(() => {
      const {
        // eslint-disable-next-line max-len, camelcase
        accountId, industry, size, kibo_region, companyOrOrganization, address1, address2, cityOrTown, stateOrProvince, postalOrZipCode, countryCode
      } = requiredData;

      p21AccountId = accountId;
      Industry = industry;
      Size = size;
      // eslint-disable-next-line camelcase
      kiboRegion = kibo_region;
      const accountPayload = {
        users: [
          {
            emailAddress: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            userName: payload.email,
            localecode: 'en-US',
          },
        ],
        companyOrOrganization: companyOrOrganization,
        accountType: 'B2B',
        isActive: true,
        isAnonymous: false,
        agreeToGDPR: true,
      };
      const billingAddress = [
        {
          types: [
            {
              name: 'Shipping',
              isPrimary: false,
            },
            {
              name: 'Billing',
              isPrimary: true,
            },
          ],
          email: payload.email,
          firstName: payload.firstName,
          lastNameOrSurname: payload.lastName,
          companyOrOrganization: companyOrOrganization,
          address: {
            address1,
            address2,
            cityOrTown,
            stateOrProvince,
            postalOrZipCode,
            countryCode,
            isValidated: true
          },
        },
      ];
      return B2bAccountCreate.b2bAccountflow(tempClient, accountPayload,
        {
          p21AccountId,
          Industry,
          Size,
          kiboRegion,
          billingAddress
        });
    })
    .then(res => {
      console.log('after update of attributes Successfully created Account');
      console.log('Kibo Response', res);
      if (res instanceof Error) {
        return Promise.reject(res);
      }
      return superagent.post('https://70uae7fha1.execute-api.us-east-2.amazonaws.com/dev')
        .send(res)
        .set('Accept', 'application/json');
      // return Promise.resolve();
    })
    .then(() => {
      context.response.body = 'Account Created';
      context.response.end();
    })
    .catch(err => {
      console.log(err.message);
      context.response.status = 400;
      context.response.body = err.message;
      context.response.end();
    });
};
