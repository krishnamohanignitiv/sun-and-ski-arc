// const request = require('requests');
// const fetch1 = require('node-fetch');
const url = require('url');
const superagent = require('superagent');
const B2bAccountSDK = require('mozu-node-sdk/clients/commerce/customer/b2BAccount');
const Client = require('mozu-node-sdk/clients/platform/application');
// const AccountCreation = require('../../utilities/b2bAccountCreationPipeline');

module.exports = function (context) {
  // eslint-disable-next-line node/no-deprecated-api
  const reqURL = url.parse(context.request.href);
  // eslint-disable-next-line prefer-object-spread
  const payload = Object.assign({}, context.request.body);
  // console.log(payload);
  const client = new Client({
    context: {
      appKey: 'CosCon.coastal_registration.1.0.0.Release',
      sharedSecret: '00c410dac56d49c7bc13ffc5d470ca44',
    },
  });

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
      .set('x-api-key', '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0');
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
      .set('x-api-key', '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0');
  }
  async function makeB2BAccount(accountInfo) {
    return superagent
      .post(
        `https://${reqURL.hostname}/coastal/api/commerce/customer/b2baccounts`
      )
      .send(accountInfo);
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
    .then(() => customerValidate())
    // eslint-disable-next-line consistent-return
    .then(res => {
      requiredData.customerValidated = JSON.parse(res.text);
      if (
        requiredData.customerValidated.data.customer_id
          === payload.accountNumber
        && requiredData.customerValidated.data.resources.customersBilltos[0]
          .phys_postal_code === payload.billingZip
      ) {
        return invoiceValidate();
      }
      throw new Error('Account not validated for Customer Account');
    })
    .then(res => {
      requiredData.invoiceValidated = JSON.parse(res.text);
      return new Promise((resolve, reject) => {
        const validateAmount = requiredData.invoiceValidated.data.findIndex(
          element => Number(element.total_amount) === Number(payload.lastInvoice)
        );
        if (validateAmount >= 0) resolve();

        reject(new Error('Account not validated for invoice amount'));
      });
    })
    .then(() => {
      console.log(requiredData.invoiceValidated.data);
      const { customer_id: accountId, customer_name: companyOrOrganization } = requiredData.customerValidated.data;
      const {
        // eslint-disable-next-line max-len
        phys_address1: address1,
        phys_address2: address2,
        phys_city: cityOrTown,
        phys_state: stateOrProvince,
        phys_postal_code: postalOrZipCode,
        phys_country: countryCode,
      } = requiredData.customerValidated.data.resources.customersBilltos[0];
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
        contacts: [
          {
            types: [
              {
                name: 'Shipping',
                isPrimary: true,
              },
              {
                name: 'Billing',
                isPrimary: false,
              },
            ],
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            address: {
              address1,
              address2,
              cityOrTown,
              stateOrProvince,
              postalOrZipCode,
              countryCode,
            },
          },
        ],
      };
      return makeB2BAccount({ payload: accountPayload, p21AccountId });
      // throw new Error('Account not validated for Invoice Account');
    })
    .then(() => {
      context.response.body = 'Account Created';
      context.response.end();
    })
    .catch(err => {
      console.dir(err);
      context.response.status = 400;
      context.response.body = err.message;
      context.response.end();
    });
};
