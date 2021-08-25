const B2bAccountSDK = require('mozu-node-sdk/clients/commerce/customer/b2BAccount');
const Client = require('mozu-node-sdk/clients/platform/application');
/**
 * Implementation for http.storefront.routes


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

module.exports = function(context) {
  const payload = Object.assign({}, context.request.body); // eslint-disable-line prefer-object-spread
  const client = new Client({ // eslint-disable-line global-require
    context: {
      tenant: 30374,
      site: 50935,
      appKey: 'CosCon.coastal_nawanit_testArc2.1.0.0.Release',
      sharedSecret: '02f7344aa4ab450193edc223a6e7c2f4',
    },
  });

  client.context['user-claims'] = null;

  const b2bAccount = new B2bAccountSDK(client);

  b2bAccount
    .addAccount({}, {
      body: payload,
    })
    .then(res => {
      const { id: accountId } = res;

      return b2bAccount.addSalesRep({ accountId, userId: '5b0e9d19811a4ea99c3588ca64ba61ca' });
    })
    .then(res => {
      const { id: accountId } = res;
      return b2bAccount.accountApprove({ accountId, status: 'approve' });
    })
    .then(res => {
      console.info('Account Created', res);
      context.response.body = 'Account created';
      context.response.end();
    })
    .catch(err => {
      console.log(err);
      context.response.body = err;
      context.response.end();
    });
};