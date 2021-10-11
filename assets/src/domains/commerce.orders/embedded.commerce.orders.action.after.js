const Client = require('mozu-node-sdk/clients/platform/application');
const PriceListController = require('../../pricelist/PriceListController');
const EntityListController = require('../../EntityList/EntityListController');
const YotpoController = require('../../Yotpo/YotpoController');

const priceList = new PriceListController();
const entityList = new EntityListController();
const yotpoOrder = new YotpoController();

module.exports = function (context, callback) {
  const order = context.get.order();
  if (order.status === 'Accepted') {
    const quoteExtendedProperty = order.extendedProperties.find(data => data.key === 'quoteId');

    console.log(quoteExtendedProperty);

    /**
     * Yotpo
     */
    const yotpoLineItems = order.items.map(product => ({
      quantity: product.quantity,
      external_product_id: product.product.productCode
    }));
    // eslint-disable-next-line no-unused-vars
    const yotpoPayload = {
      order: {
        external_id: order.id,
        order_date: order.acceptedDate,
        customer: {
          external_id: order.billingInfo.billingContact.id,
          email: order.billingInfo.billingContact.email,
          first_name: order.billingInfo.billingContact.firstName,
          last_name: order.billingInfo.billingContact.lastName,
          accepts_sms_marketing: false,
          accepts_email_marketing: false
        },
        line_items: yotpoLineItems,
        fulfillments: []
      }
    };
    // Yotpo End

    if (!quoteExtendedProperty) {
      console.log('No quote extendedProperty');
      yotpoOrder.createOrder(yotpoPayload)
        .then(res => {
          console.log(res);
          callback();
        })
        .catch(err => {
          console.log(err);
          callback();
        });
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
      .then(() => yotpoOrder.createOrder(yotpoPayload))
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
