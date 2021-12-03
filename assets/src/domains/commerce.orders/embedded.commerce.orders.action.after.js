/* eslint-disable no-unused-vars */
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
    console.log(order.billingInfo.billingContact);

    // /**
    //  * Yotpo
    //  */
    // const yotpoLineItems = order.items.map(product => ({
    //   quantity: product.quantity,
    //   external_product_id: product.product.productCode
    // }));

    // // eslint-disable-next-line no-unused-vars
    // const yotpoPayload = {
    //   order: {
    //     external_id: order.orderNumber,
    //     order_date: order.acceptedDate,
    //     currencyCode: order.currencyCode,
    //     customer: {
    //       external_id: order.billingInfo.billingContact.id,
    //       email: order.billingInfo.billingContact.email,
    //       first_name: order.billingInfo.billingContact.firstName,
    //       last_name: order.billingInfo.billingContact.lastNameOrSurname,
    //       accepts_sms_marketing: false,
    //       accepts_email_marketing: false
    //     },
    //     line_items: yotpoLineItems,
    //     fulfillments: [{
    //       fulfillment_date: order.acceptedDate,
    //       external_id: order.orderNumber,
    //       status: 'pending',
    //       fulfilled_items: yotpoLineItems
    //     }]
    //   }
    // };

    // console.log(yotpoPayload.fulfillments);
    // console.log(yotpoLineItems);
    // // Yotpo End

    if (!quoteExtendedProperty) {
      console.log('No quote extendedProperty');
      callback();
      // yotpoOrder.createOrder(yotpoPayload)
      //   .then(res => {
      //     console.log(res);
      //     console.log('Order Created');
      //     callback();
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     callback();
      //   });
    } else {
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
        // .then(() => yotpoOrder.createOrder(yotpoPayload))
      // eslint-disable-next-line no-unused-vars
        .then(res => {
          console.log('Done');
          callback();
        })
        .catch(err => {
          console.log(err);
          callback();
        });
    }
  } else {
    console.log('Unwanted Console');
    callback();
  }
};
