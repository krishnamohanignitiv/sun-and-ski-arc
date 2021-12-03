const Client = require('mozu-node-sdk/clients/platform/application');
const B2BAccount = require('../../utilities/b2bAccountCreationPipeline');
// const B2bAccountSDK = require('../../../resources/b2bAccount');
const B2bAccountCreate = new B2BAccount();

module.exports = function (context) {
  const payload = Object.assign({}, context.request.body.payload); // eslint-disable-line prefer-object-spread
  // let p21AccountId = null;
  // if (context.request.body.p21AccountId) {
  //   p21AccountId = context.request.body.p21AccountId;
  // }
  // const client = new Client({
  //   context: {
  //     appKey: 'CosCon.coastal_registration.1.0.0.Release',
  //     sharedSecret: '00c410dac56d49c7bc13ffc5d470ca44',
  //   },
  // });

  const clientContext = new Client();

  // client.context['user-claims'] = null;

  // const b2bAccount = new B2bAccountSDK(client);

  // b2bAccount
  //   .addAccount(
  //     {},
  //     {
  //       body: payload,
  //     }
  //   )
  //   .then(res => {
  //     console.log(res);
  //     const { id: accountId } = res;

  //     return b2bAccount.addSalesRep({
  //       accountId,
  //       userId: 'e0f6008ea91544a59b0d667406e372c2',
  //     });
  //   })
  //   .then(res => {
  //     const { id: accountId } = res;
  //     return b2bAccount.accountApprove({ accountId, status: 'approve' });
  //   })
  //   .then(res => {
  //     if (p21AccountId) {
  //       return b2bAccount.addB2BAccountAttribute(
  //         { accountId: res.id, attributeFQN: 'tenant~account_id' },
  //         {
  //           body: {
  //             fullyQualifiedName: 'tenant~account_id',
  //             values: [p21AccountId],
  //           },
  //         }
  //       );
  //     }
  //     return Promise.resolve('Creating New User');
  //   })
  B2bAccountCreate.b2bAccountflow(clientContext, payload)
    .then(res => {
      console.log(res);
      if (res instanceof Error) {
        return Promise.reject(res);
      }
      return Promise.resolve();
    })
    .then(() => {
      // console.log(res);
      // context.response.status = 201;
      context.response.body = 'Successfully Created Account';
      context.response.end();
    })
    .catch(err => {
      context.response.status = 400;
      context.response.body = err.message;
      context.response.end();
    });
  // .catch(err => {
  //   console.log(err.originalError.message);
  //   const newErr = new Error(err.originalError.message);
  //   context.response.status = 400;
  //   context.response.body = newErr.message;
  //   context.response.end();
  // });
};
