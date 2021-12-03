const Client = require('mozu-node-sdk/clients/platform/application');
const PriceListController = require('../../pricelist/PriceListController');
const EntityListController = require('../../EntityList/EntityListController');

const priceList = new PriceListController();
const entityList = new EntityListController();

module.exports = function (context) {
  // eslint-disable-next-line prefer-object-spread
  const payload = Object.assign({}, context.request.body);
  console.log(payload);
  // const clientContext = new Client({
  //   context: {
  //     appKey: 'CosCon.coastal_registration.1.0.0.Release',
  //     sharedSecret: '00c410dac56d49c7bc13ffc5d470ca44',
  //   },
  // });
  const clientContext = new Client();

  priceList
    .getPriceList(clientContext, payload.priceListCode)
    .then(() => priceList.updateB2BAccount(clientContext, {
      accountId: payload.userInfo.accountId,
      priceListCode: payload.priceListCode,
    }))
    .then(() => entityList.getEntity(clientContext, {
      entityListFQN: payload.entityListFQN,
      quoteId: payload.priceListCode,
    }))
    .then(res => {
      context.exec.setPriceListCode(payload.priceListCode);
      console.log(res);
      context.response.body = res;
      context.response.end();
    })
    .catch(err => {
      context.response.status = err.originalError.statusCode;
      context.response.body = err.originalError.message;
      context.response.end();
    });
};

// module.exports = function (context) {
//   console.log('Hello world');
//   context.response.body = 'Hello World';
//   context.response.end();
// };
