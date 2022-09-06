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
  let contactId;
  let termsId;
  let shipToId;
  console.log(contactId, termsId, shipToId);
  /**
   * All async functions
   */

  async function validateExistingAccount(accountNumber) {
    return b2bAccount.getB2BAccounts({
      filter: `attributes.value eq ${accountNumber}`,
    });
  }

  // const validateAccount = () => superagent.post('https://0k2s3v9lbl.execute-api.us-east-2.amazonaws.com/dev/customer-validation')
  //   .send(JSON.stringify(payload)).set('Accept', 'application/json');

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
    .then(() => superagent.post('https://0k2s3v9lbl.execute-api.us-east-2.amazonaws.com/dev/customer-validation')
      .send(JSON.stringify(payload)).set('Accept', 'application/json'))
    .then(res => {
      const response = JSON.parse(res.text);
      console.log(response);
      if (response.invoice.invoiceValidated && response.customer.customerValidated) {
        contactId = response.customer.contact.contactID;
        shipToId = response.customer.shipToId;
        termsId = response.customer.termsId;
        const {
          // eslint-disable-next-line camelcase
          accountId, industry, size, kibo_region, companyOrOrganization, address1, address2, cityOrTown, stateOrProvince, postalOrZipCode, countryCode
        } = response.customer;
        console.log('Data validated');
        console.log(accountId, industry, size, kibo_region, companyOrOrganization, address1, address2, cityOrTown, stateOrProvince, postalOrZipCode, countryCode, contactId, shipToId, termsId);
        p21AccountId = accountId;
        Industry = industry;
        Size = size;
        // eslint-disable-next-line camelcase
        kiboRegion = kibo_region.toString();
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
            billingAddress,
            contactId,
            shipToId,
            termsId
          });
      }
      // code for not validated data
      return null;
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
