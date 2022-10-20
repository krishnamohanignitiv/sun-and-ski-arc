const OrderItemSDK = require('mozu-node-sdk/clients/commerce/orders/orderItem');

module.exports = (context, callback) => {
  const orderItemSdk = new OrderItemSDK(context);
  orderItemSdk.context['user-claims'] = null;
  const SURCHARGEFQN = 'tenant~surcharge';

  const getAllOrderItems = orderId => orderItemSdk.getOrderItems({
    orderId: orderId
  });

  const updateItemPrice = payload => new Promise((resolve, reject) => {
    orderItemSdk.updateItemProductPrice(payload).then(res => resolve(res)).catch(e => {
      console.log(e);
      reject(e);
    });
  });

  const createPayload = (orderId, itemId, newPrice) => ({
    orderId: orderId, orderItemId: itemId, price: newPrice, updatemode: 'ApplyToOriginal'
  });

  const getSurcharge = options => options.filter(o => o.attributeFQN === SURCHARGEFQN)[0];

  const calculateNewPrice = product => {
    console.log('calculation of new Price');
    const { options, price } = product;
    console.log('Product Options', options);
    console.log('Product Price', price);
    const { shopperEnteredValue } = getSurcharge(options);
    console.log('Surcharge Value Received', shopperEnteredValue);
    const surchargeValue = parseFloat(shopperEnteredValue);
    console.log('New Price of Product', price.salePrice ? price.salePrice + surchargeValue
      : price.price + surchargeValue);
    return price.salePrice ? price.salePrice + surchargeValue : price.price + surchargeValue;
  };

  const main = () => {
    const { url } = context.request;
    const orderId = url.split('/')[url.split('/').length - 1];
    getAllOrderItems(orderId).then(res => {
      const promises = [];
      res.items.forEach(item => {
        const { product } = item;
        promises.push(updateItemPrice(createPayload(orderId, item.id, calculateNewPrice(product))));
        // callback();
      });
      Promise.all(promises).then(response => {
        console.log('response after order item price update', response);
        callback();
      });
    }).catch(e => {
      console.log('error occurred when order item api failed', e);
      callback();
    });
  };

  try {
    main();
  } catch (e) {
    console.log(e);
    callback();
  }
};

// var _ = require('underscore');
// var appsClient = require('mozu-node-sdk/clients/platform/application')();
// var orderItemClient = require('mozu-node-sdk/clients/commerce/orders/orderItem');
// module.exports = function(context, callback) {

//   console.log(context.request);
//   var orderId = context.request.path.split('/checkout/')[1];
//   console.log('order id - ',orderId);

//   var orderItemResource = orderItemClient(context.apiContext);
//     orderItemResource.context["user-claims"] = null;

//   var finalItems = [], ehfOption;
//   orderItemResource.getOrderItems({orderId:orderId}).then(function(data){
//     for(var i=0; i < data.items.length; i++){
//       ehfOption = _.find(data.items[i].product.options, function(option){
//         return option.attributeFQN === 'tenant~ehf-fees';
//       });
//       if(ehfOption && data.items[i].fulfillmentMethod === 'Pickup') {
//         console.log('promise created for - ',data.items[i].product.productCode);
//         finalItems.push(createItemPromise(orderId, data.items[i]));
//       }
//     }
//     console.log(finalItems.length);
//     if(finalItems.length > 0 ){
//       Promise.all(finalItems).then(function(response){
//         console.log('All Promises resolved');
//         callback();
//       });
//     }else {
//       console.log('No products with EHF');
//       callback();
//     }
//   });

//   var createItemPromise = function(orderId, item){
//     var newItemPrice;
//     if(ehfOption){
//       var ehfprice = parseFloat(ehfOption.shopperEnteredValue);
//       var itemEHFTotal = ehfprice;
//       console.log('Item ehfTotal - ',itemEHFTotal);
//       if(item.product.price.salePrice){
//         newItemPrice = parseFloat(item.product.price.salePrice + itemEHFTotal).toFixed(2);
//       }else{
//         newItemPrice = parseFloat(item.product.price.price + itemEHFTotal).toFixed(2);
//       }
//     }
//     return new Promise(function(resolve, reject){
//       orderItemResource.updateItemProductPrice({
//       orderId:orderId,
//       orderItemId:item.id,
//       price:newItemPrice,updatemode:'ApplyToOriginal'}).then(
//       function(response){
//         resolve(response);
//       }).catch(function(err){
//         console.log('err');
//         console.log(err);
//         reject(err);
//       });
//     });
//   };
// };
