/* eslint-disable no-unused-vars */
const PriceListClient = require('mozu-node-sdk/clients/commerce/catalog/admin/priceList');
const B2bAccountSDK = require('mozu-node-sdk/clients/commerce/customer/b2BAccount');
const Client = require('mozu-node-sdk/clients/platform/application');

class PriceListServices {
  async getPriceList(context, priceListCode) {
    const priceListClient = new PriceListClient(context);
    priceListClient.context['user-claims'] = null;
    return priceListClient.getPriceList({
      priceListCode: priceListCode
    });
  }

  async updateB2BAccount(context, payload) {
    const b2bAccountClient = new B2bAccountSDK(context);
    b2bAccountClient.context['user-claims'] = null;
    return b2bAccountClient.updateAccount({
      accountId: payload.accountId
    }, {
      body: {
        // companyOrOrganization: payload.userInfo.companyOrOrganization,
        priceList: payload.priceListCode
      }
    });
  }

  processPriceListChange(context) {
    console.log('Hello from pricelistcontroller');
    const payload = context.request.body;
    const clientContext = new Client({
      context: {
        appKey: 'CosCon.coastal_registration.1.0.0.Release',
        sharedSecret: '00c410dac56d49c7bc13ffc5d470ca44',
      },
    });

    this.getPriceList(clientContext, payload.priceListCode)
      .then(res => {
        console.log('Hello World');
        context.response.body = 'Getting PriceList';
        context.response.end();
      });
  }
}

module.exports = PriceListServices;
