const B2bAccountSDK = require('mozu-node-sdk/clients/commerce/customer/b2BAccount');

module.exports = function (client, payload) {
  const b2bAccount = new B2bAccountSDK(client);

  b2bAccount
    .addAccount(
      {},
      {
        body: payload,
      }
    )
    .then(res => {
      const { id: accountId } = res;

      return b2bAccount.addSalesRep({
        accountId,
        userId: '5b0e9d19811a4ea99c3588ca64ba61ca',
      });
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
      context.response.status = 400;
      context.response.body = err.message;
      context.response.end();
    });
};
