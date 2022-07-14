const B2bAccountSDK = require('../../resources/b2bAccount');
// const Client = require('mozu-node-sdk/clients/platform/application');

class B2BAccount {
  b2bAccountflow(context, payload, additionalInfo = {}) {
    console.log('payloadpayloadpayload', payload);
    console.log('contextcontextcontext', context);
    console.log('additionalInfoadditionalInfo', additionalInfo);
    const b2bAccount = new B2bAccountSDK(context);
    console.log('b2bAccountb2bAccount', b2bAccount);
    b2bAccount.context['user-claims'] = null;
    let p21AccountId = null;
    // const kiboRegion = null;
    // const Size = null;
    // const Industry = null;
    if (additionalInfo.p21AccountId) {
      p21AccountId = additionalInfo.p21AccountId;
    }

    return b2bAccount.addAccount({}, { body: payload })
      .then(res => {
        console.log('resresresresres', res);
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
        console.log('p21AccountIdp21AccountId', p21AccountId);
        if (p21AccountId) {
          const { billingAddress } = additionalInfo;
          const promises = [];
          promises.push(b2bAccount.addB2BAccountAttribute(
            { accountId: res.id, attributeFQN: 'tenant~account_id' },
            {
              body: {
                fullyQualifiedName: 'tenant~account_id',
                values: [p21AccountId],
              },
            }
          ));
          promises.push(b2bAccount.addB2BAccountAttribute(
            { accountId: res.id, attributeFQN: 'tenant~kibo_region' },
            {
              body: {
                fullyQualifiedName: 'tenant~kibo_region',
                values: ['SF'],
              },
            }
          ));
          promises.push(b2bAccount.addB2BAccountAttribute(
            { accountId: res.id, attributeFQN: 'tenant~size' },
            {
              body: {
                fullyQualifiedName: 'tenant~size',
                values: ['VS'],
              },
            }
          ));
          promises.push(b2bAccount.addB2BAccountAttribute(
            { accountId: res.id, attributeFQN: 'tenant~industry' },
            {
              body: {
                fullyQualifiedName: 'tenant~industry',
                values: ['54'],
              },
            }
          ));
          promises.push(b2bAccount.addContact(
            { accountId: res.id },
            {
              body: billingAddress
            }
          ));
          // promises.push(b2bAccount.updateAccount(
          //   { accountId: res.id },
          //   {
          //     body: {
          //       id: res.id,
          //       attributes: [
          //         {
          //           fullyQualifiedName: 'tenant~kibo_region',
          //           values: [additionalInfo.kibo_region],
          //         },
          //         {
          //           fullyQualifiedName: 'tenant~size',
          //           values: [additionalInfo.size],
          //         },
          //         {
          //           fullyQualifiedName: 'tenant~industry',
          //           values: [additionalInfo.industry],
          //         }
          //       ]
          //     },
          //   },
          // ));
          return Promise.all(promises);
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
