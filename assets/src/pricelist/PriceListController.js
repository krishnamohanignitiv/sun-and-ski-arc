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
    const currentB2BAccount = await b2bAccountClient.getB2BAccount({
      accountId: payload.accountId
    });
    currentB2BAccount.priceList = payload.priceListCode;
    return b2bAccountClient.updateAccount({
      accountId: payload.accountId
    }, {
      body: currentB2BAccount
    });
  }

  processPriceListChange(context) {
    console.log('Hello from pricelistcontroller');
    const payload = context.request.body;
    const clientContext = new Client({
      context: {
        appKey: 'CosCon.coastal_registration_QA.1.0.0.Release',
        sharedSecret: '56159cf5e5d94df6a0060ec42238af85',
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
