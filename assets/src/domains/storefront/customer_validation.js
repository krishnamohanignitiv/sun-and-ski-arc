// const request = require('requests');
// const fetch1 = require('node-fetch');
// const url = require('url');
const superagent = require('superagent');
const Client = require('mozu-node-sdk/clients/platform/application');
const B2bAccountSDK = require('../../../resources/b2bAccount');
const B2BAccount = require('../../utilities/b2bAccountCreationPipeline');
// const AccountCreation = require('../../utilities/b2bAccountCreationPipeline');

const B2bAccountCreate = new B2BAccount();

module.exports = function (context) {
  // eslint-disable-next-line node/no-deprecated-api
  // const reqURL = url.parse(context.request.href);
  // eslint-disable-next-line prefer-object-spread
  const payload = Object.assign({}, context.request.body);
  // console.log(payload);
  const client = new Client({
    context: {
      appKey: 'CosCon.coastal_registration.1.0.0.Release',
      sharedSecret: '00c410dac56d49c7bc13ffc5d470ca44',
    },
  });

  const tempClient = new Client();

  client.context['user-claims'] = null;
  const b2bAccount = new B2bAccountSDK(client);

  let p21AccountId;

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

  // async function makeB2BAccount(accountInfo) {
  //   return superagent
  //     .post(
  //       `https://${reqURL.hostname}/coastal/api/commerce/customer/b2baccounts`
  //     )
  //     .send(accountInfo);
  //   // .then(() => {
  //   //   console.log('B2B new Account Custom Function Success');
  //   // })
  //   // .catch(err => {
  //   //   console.log('Error Block');
  //   //   console.log(err.response.text);
  //   //   throw new Error(err.response.text);
  //   // });
  // }
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
        accountId, companyOrOrganization, address1, address2, cityOrTown, stateOrProvince, postalOrZipCode, countryCode
      } = requiredData;

      p21AccountId = accountId;
      // const invoiceLength = requiredData.invoiceValidated.data.length - 1;
      // eslint-disable-next-line eqeqeq
      // if (requiredData.invoiceValidated.data[invoiceLength].total_amount == payload.lastInvoice) {
      //   const accountPayload = {
      //     users: [
      //       {
      //         emailAddress: emailAddress,
      //         firstName: companyOrOrganization,
      //         lastName: '',
      //         userName: emailAddress,
      //         localecode: 'en-US'
      //       }
      //     ],
      //     companyOrOrganization: companyOrOrganization,
      //     accountType: 'B2B',
      //     emailAddress: emailAddress,
      //     isActive: true,
      //     firstName: companyOrOrganization,
      //     lastName: '',
      //     isAnonymous: false,
      //     agreeToGDPR: true,
      //     contacts: [{
      //       type: [{
      //         name: 'Shipping',
      //         isPrimary: true,
      //       }, {
      //         name: 'Billing',
      //         isPrimary: false,
      //       }],
      //       email: emailAddress,
      //       firstName: companyOrOrganization,
      //       address: {
      //         address1,
      //         address2,
      //         cityOrTown,
      //         stateOrProvince,
      //         postalOrZipCode,
      //         countryCode,
      //       }
      //     }],
      //   };
      //   // AccountCreation(clientContext, accountPayload);
      //   context.response.body = 'Success';
      //   context.response.end();
      //   return;
      // }
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
          },
        },
      ];
      // eslint-disable-next-line prefer-object-spread
      return B2bAccountCreate.b2bAccountflow(tempClient, accountPayload,
        { p21AccountId, billingAddress });
      // return makeB2BAccount({ payload: accountPayload, p21AccountId });
      // throw new Error('Account not validated for Invoice Account');
    })
    .then(res => {
      console.log(res);
      if (res instanceof Error) {
        return Promise.reject(res);
      }
      return Promise.resolve();
    })
    .then(() => {
      context.response.body = 'Account Created';
      context.response.end();
    })
    .catch(err => {
      console.log(err.message);
      // let newErr;
      // if (err.originalError.message) {
      //   newErr = new Error(err.originalError.message);
      // } else {
      //   newErr = err;
      // }
      // // console.log(newErr);
      // console.log(newErr.message);
      context.response.status = 400;
      context.response.body = err.message;
      context.response.end();
    });
};
