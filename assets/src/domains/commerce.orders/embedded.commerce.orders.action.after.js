const Client = require('mozu-node-sdk/clients/platform/application');
const PriceListController = require('../../pricelist/PriceListController');
const EntityListController = require('../../EntityList/EntityListController');

const priceList = new PriceListController();
const entityList = new EntityListController();

module.exports = function (context, callback) {
  /**
   * Set priceList to default
   */
  const order = context.get.order();
  if (order.status === 'Accepted') {
    const quoteExtendedProperty = order.extendedProperties.find(data => data.key === 'quoteId');

    console.log(quoteExtendedProperty);

    if (!quoteExtendedProperty) {
      console.log('No quote extendedProperty');
      callback();
    }

    const productToUpdate = order.items.map(product => ({
      productCode: product.product.productCode,
      availableQty: product.quantity
    }));

    const payload = {
      entityListFQN: 'quotelist@coastal',
      quoteId: quoteExtendedProperty.value,
      productToUpdate
    };

    const clientContext = new Client();

    const promises = [entityList.updateEntity(clientContext, payload), priceList.updateB2BAccount(context, {
      accountId: order.customerAccountId,
      priceListCode: 'default'
    })];

    Promise.all(promises)
      // eslint-disable-next-line no-unused-vars
      .then(res => {
        console.log('Done');
        callback();
      })
      .catch(err => {
        console.log(err);
        callback();
      });

    // entityList
    //   .updateEntity(clientContext, payload)
    // // eslint-disable-next-line no-unused-vars
    //   .then(res => {
    //   // console.log(res);
    //     callback();
    //   });

    // priceList
    // .updateB2BAccount(clientContext,{

    // })
  } else {
    callback();
  }
};
