// const superagent = require('superagent');
const B2bAccountSDK = require('../../resources/b2bAccount');
// const Client = require('mozu-node-sdk/clients/platform/application');
let kiboAccountId;
class B2BAccount {
  b2bAccountflow(context, payload, additionalInfo = {}) {
    console.log('payloadpayloadpayload', payload);
    console.log('contextcontextcontext', context);
    console.log('additionalInfoadditionalInfo', additionalInfo);
    const b2bAccount = new B2bAccountSDK(context);
    console.log('b2bAccountb2bAccount', b2bAccount);
    b2bAccount.context['user-claims'] = null;
    const kiboSize = additionalInfo.Size.replace(/-/g, '').substring(0, 2);
    const emailId = additionalInfo.billingAddress[0].email;
    let p21AccountId = null;
    let kiboRegion = null;
    let Size = null;
    let Industry = null;
    if (additionalInfo.p21AccountId) {
      p21AccountId = additionalInfo.p21AccountId;
    }
    if (additionalInfo.kiboRegion === '10') {
      kiboRegion = 'AT';
    }
    if (additionalInfo.Size) {
      Size = kiboSize;
    }
    if (additionalInfo.Industry) {
      Industry = additionalInfo.Industry;
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
        console.log('p21AccountIdp21AccountId', p21AccountId, kiboRegion, Size, Industry);
        kiboAccountId = res.id.toString();
        console.log('res.id', typeof res.id.toString());
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
            { accountId: res.id, attributeFQN: 'tenant~account_id' },
            {
              body: {
                fullyQualifiedName: 'tenant~kibo-region',
                values: [kiboRegion],
              },
            }
          ));
          promises.push(b2bAccount.addB2BAccountAttribute(
            { accountId: res.id, attributeFQN: 'tenant~account_id' },
            {
              body: {
                fullyQualifiedName: 'tenant~kibo_size',
                values: [Size],
              },
            }
          ));
          promises.push(b2bAccount.addB2BAccountAttribute(
            { accountId: res.id, attributeFQN: 'tenant~account_id' },
            {
              body: {
                fullyQualifiedName: 'tenant~industry',
                values: [Industry],
              },
            }
          ));
          promises.push(b2bAccount.addContact(
            { accountId: res.id },
            {
              body: billingAddress
            }
          ));
          return Promise.all(promises);
        }
        return Promise.resolve('Creating New User');
      })
      .then(() => {
        console.log('kiboAccountId', kiboAccountId);
        const customerApiPayload = {
          p21CustomerId: p21AccountId,
          kiboRegion: kiboRegion,
          industry: Industry,
          size: Size,
          kiboCustomerId: kiboAccountId,
          kiboCustomerEmailId: emailId,
          enable_flag: 'true'
        };
        // console.log('After Account created', customerApiPayload);
        return customerApiPayload;
      })
      .catch(err => {
        console.log(err.originalError.message);
        return new Error(err.originalError.message);
      });
  }
}

module.exports = B2BAccount;
