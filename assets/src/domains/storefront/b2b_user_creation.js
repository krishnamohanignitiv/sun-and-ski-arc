const B2bAccountSDK = require('mozu-node-sdk/clients/commerce/customer/b2BAccount');
const Client = require('mozu-node-sdk/clients/platform/application');

module.exports = function (context) {
  const payload = Object.assign({}, context.request.body); // eslint-disable-line prefer-object-spread
  const client = new Client({
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
