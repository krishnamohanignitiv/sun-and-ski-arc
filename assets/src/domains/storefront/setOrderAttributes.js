/* eslint-disable no-unused-vars */
const OrderAttrSdk = require('mozu-node-sdk/clients/commerce/orders/orderAttribute');

module.exports = (context, callback) => {
  const orderAttrSdk = new OrderAttrSdk(context);
  orderAttrSdk.context['user-claims'] = null;
  console.log('Arc running');
  context.response.body = 'responding';
  const { poNumber } = context.request.body;
  const { jobName } = context.request.body;
  const { orderId } = context.request.body;
  console.log('poNumber', 'jobName', 'orderId', poNumber, jobName, orderId);
  const main = () => {
    orderAttrSdk.updateOrderAttributes({
      orderId: orderId,
      removeMissing: true
    }, [{
      fullyQualifiedName: 'tenant~po_number',
      values: [poNumber]
    }, {
      fullyQualifiedName: 'tenant~job_name',
      values: [jobName]
    }]).then(() => {
      context.response.body = 'Attributes added';
      callback();
    }).catch(e => {
      console.log(e);
      callback();
    });
  };
  main();
};
/*
[{
fullyQualifiedName: string┃null
attributeDefinitionId: integer┃null
values: [{missing-type-info}]
}]
*/
