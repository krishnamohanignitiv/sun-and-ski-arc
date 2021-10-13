const B2bAccountSDK = require('../../resources/b2bAccount');
// const Client = require('mozu-node-sdk/clients/platform/application');

class B2BAccount {
  b2bAccountflow(context, payload) {
    console.log(payload);
    const b2bAccount = new B2bAccountSDK(context);
    b2bAccount.context['user-claims'] = null;
    let p21AccountId = null;
    if (payload.p21AccountId) {
      p21AccountId = payload.p21AccountId;
    }

    return b2bAccount.addAccount({}, { body: payload })
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
      .then(() => 'Successfully created Account')
      .catch(err => {
        console.log(err.originalError.message);
        return new Error(err.originalError.message);
      });
  }
}

module.exports = B2BAccount;
