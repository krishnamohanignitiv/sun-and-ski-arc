// const request = require('requests');
// const fetch1 = require('node-fetch');
const url = require('url');
const superagent = require('superagent');
const Client = require('mozu-node-sdk/clients/platform/application');
const AccountCreation = require('../../utilities/b2bAccountCreationPipeline');

module.exports = function (context) {
  // let url = new URL(context.request.href);
  // eslint-disable-next-line node/no-deprecated-api
  const reqURL = url.parse(context.request.href);
  // eslint-disable-next-line prefer-object-spread
  const payload = Object.assign({}, context.request.body);
  // const clientContext = new Client({
  //   context: {
  //     appKey: 'CosCon.coastal_registration.1.0.0.Release',
  //     sharedSecret: '00c410dac56d49c7bc13ffc5d470ca44',
  //   },
  // });

  // clientContext.context['user-claims'] = null;

  const requiredData = {};
  async function customerValidate() {
    return superagent
      .get(
        `https://api.simpleapps.net/ecommerce/customers/${payload.accountNumber}`
      )
      .query({ resource_list: 'all' })
      .set('x-api-key', '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0')
      .set('siteid', 'coastalone');
  }
  async function invoiceValidate() {
    return superagent
      .get(
        `https://api.simpleapps.net/ecommerce/invoices?resource_list=all&customer_id=${payload.accountNumber}&limit=5`
      )
      .set('x-api-key', '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0')
      .set('siteid', 'coastalone');
  }
  async function makeB2BAccount(accountInfo) {
    return superagent
      .post(
        `https://${reqURL.hostname}/coastal/api/commerce/customer/b2baccounts`
      )
      .send(accountInfo);
  }
  customerValidate()
    // eslint-disable-next-line consistent-return
    .then(res => {
      requiredData.customerValidated = JSON.parse(res.text);
      // eslint-disable-next-line eqeqeq
      if ((requiredData.customerValidated.data.customer_id == payload.accountNumber)
        // eslint-disable-next-line eqeqeq
        && (requiredData.customerValidated.data.resources.customersBilltos[0].phys_postal_code == payload.billingZip)) {
        return invoiceValidate();
      }
      throw new Error('Account not validated for Customer Account');
    })
    // eslint-disable-next-line consistent-return
    .then(res => {
      console.log(requiredData.customerValidated.data.resources.customersBilltos[0]);
      // requiredData.invoiceValidated = JSON.parse(res.text);
      const { customer_id: accountId, customer_name: companyOrOrganization } = requiredData.customerValidated.data;
      const {
        // eslint-disable-next-line max-len
        phys_address1: address1, phys_address2: address2, phys_city: cityOrTown, phys_state: stateOrProvince, phys_postal_code: postalOrZipCode, phys_country: countryCode, email_address: emailAddress
      } = requiredData.customerValidated.data.resources.customersBilltos[0];
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
      console.log(emailAddress);
      const accountPayload = {
        users: [
          {
            emailAddress: emailAddress,
            firstName: companyOrOrganization,
            lastName: '',
            userName: emailAddress,
            localecode: 'en-US'
          }
        ],
        companyOrOrganization: companyOrOrganization,
        accountType: 'B2B',
        emailAddress: emailAddress,
        isActive: true,
        firstName: companyOrOrganization,
        lastName: '',
        isAnonymous: false,
        agreeToGDPR: true,
        contacts: [{
          types: [{
            name: 'Shipping',
            isPrimary: true,
          }, {
            name: 'Billing',
            isPrimary: false,
          }],
          email: emailAddress,
          firstName: companyOrOrganization,
          address: {
            address1,
            address2,
            cityOrTown,
            stateOrProvince,
            postalOrZipCode,
            countryCode,
          }
        }],
      };
      return makeB2BAccount(accountPayload);
      // throw new Error('Account not validated for Invoice Account');
    })
    .then(() => {
      context.response.body = 'Account Created';
      context.response.end();
    })
    .catch(err => {
      console.log(err);
      context.response.status = 400;
      context.response.body = err.message;
      context.response.end();
    });
};
