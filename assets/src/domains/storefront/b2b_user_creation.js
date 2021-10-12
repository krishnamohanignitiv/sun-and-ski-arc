const Client = require('mozu-node-sdk/clients/platform/application');
const B2bAccountSDK = require('../../../resources/b2bAccount');

module.exports = function (context) {
  const payload = Object.assign({}, context.request.body.payload); // eslint-disable-line prefer-object-spread
  let p21AccountId = null;
  if (context.request.body.p21AccountId) {
    p21AccountId = context.request.body.p21AccountId;
  }
  const client = new Client({
    context: {
      appKey: 'CosCon.coastal_registration.1.0.0.Release',
      sharedSecret: '00c410dac56d49c7bc13ffc5d470ca44',
    },
  });

  client.context['user-claims'] = null;

  const b2bAccount = new B2bAccountSDK(client);

  b2bAccount
    .addAccount(
      {},
      {
        body: payload,
      }
    )
    .then(res => {
      console.log(res);
      const { id: accountId } = res;

      return b2bAccount.addSalesRep({
        accountId,
        userId: 'e0f6008ea91544a59b0d667406e372c2',
      });
    })
    .then(res => {
      const { id: accountId } = res;
      return b2bAccount.accountApprove({ accountId, status: 'approve' });
    })
    .then(res => {
      if (p21AccountId) {
        return b2bAccount.addB2BAccountAttribute(
          { accountId: res.id, attributeFQN: 'tenant~account_id' },
          {
            body: {
              fullyQualifiedName: 'tenant~account_id',
              values: [p21AccountId],
            },
          }
        );
      }
      return Promise.resolve('Creating New User');
    })
    .then(() => {
      // console.log(res);
      // context.response.status = 201;
      context.response.body = 'Successfully Created Account';
      context.response.end();
    })
    .catch(err => {
      console.log(err.originalError.message);
      context.response.status = 400;
      context.response.body = err.originalError.message;
      context.response.end();
    });
};
