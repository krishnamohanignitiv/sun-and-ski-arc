/* eslint-disable max-len */
/**
 * Implementation for http.storefront.pages.checkout.request.before

 * HTTP Actions all receive a similar context object that includes
 * `request` and `response` objects. These objects are similar to
 * http.IncomingMessage objects in NodeJS.
  {
    configuration: {},
    request: http.ClientRequest,
    response: http.ClientResponse
  }
 * Call `response.end()` to end the response early.
 * Call `response.set(headerName)` to set an HTTP header for the response.
 * `request.headers` is an object containing the HTTP headers for the request.
 *
 * The `request` and `response` objects are both Streams and you can read
 * data out of them the way that you would in Node.
 */

const OrderItemClient = require('mozu-node-sdk/clients/commerce/orders/orderItem');

function calculateNewPrice(surcharge, price) {
  return ((surcharge / 100) * price) + price;
}

module.exports = context => {
  const orderItemResource = OrderItemClient(context.apiContext);
  orderItemResource.context['user-claims'] = null;
  const orderId = context.request.path.split('/')[2];
  const promises = [];

  function changeItemPrice(itemId, newPrice) {
    return new Promise((resolve, reject) => {
      orderItemResource.updateItemProductPrice({
        orderId: orderId,
        orderItemId: itemId,
        price: newPrice,
        updatemode: 'ApplyToOriginal'
      }).then(res => {
        resolve(res);
      }).catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }

  orderItemResource.getOrderItems({ orderId: orderId }).then(res => {
    res.items.forEach(item => {
      if (item.product.properties.filter(property => property.name === 'Surcharge').length > 0) {
        const surcharge = item.product.properties.filter(property => property.name === 'Surcharge').map(property => property.values[0])[0].value;
        const itemPrice = item.product.price.salePrice ? item.product.price.salePrice : item.product.price.price;
        const newPrice = calculateNewPrice(surcharge, itemPrice);
        promises.push(changeItemPrice(item.id, newPrice));
      }
    });
    if (promises.length > 0) {
      Promise.all(promises).then(() => {
        console.log('all promises resolved');
        context.response.end();
      });
    } else {
      console.log('No surcharge added');
      context.response.end();
    }
  }).catch(err => console.log(err));
};
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
