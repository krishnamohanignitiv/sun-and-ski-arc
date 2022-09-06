// const superagent = require('superagent');
const B2bAccountSDK = require('../../resources/b2bAccount');
// const Client = require('mozu-node-sdk/clients/platform/application');
let kiboAccountId;

class B2BAccount {
  // eslint-disable-next-line consistent-return
  b2bAccountflow(context, payload, additionalInfo = {}) {
    const b2bAccount = new B2bAccountSDK(context);
    b2bAccount.context['user-claims'] = null;
    if (Object.keys(additionalInfo).length > 0) {
      // const kiboSize = additionalInfo.Size.replace(/-/g, '').substring(0, 2);
      const emailId = additionalInfo.billingAddress[0].email;
      let p21AccountId = null;
      let kiboRegion = null;
      let Size = null;
      let Industry = null;
      let contactId = null;
      let shipToId = null;
      let termsId = null;
      if (additionalInfo.p21AccountId) {
        p21AccountId = additionalInfo.p21AccountId.toString();
      }
      if (additionalInfo.contactId) {
        contactId = additionalInfo.contactId;
      }
      if (additionalInfo.shipToId) {
        shipToId = additionalInfo.shipToId.toString();
      }
      if (additionalInfo.termsId) {
        termsId = additionalInfo.termsId;
      }
      if (additionalInfo.kiboRegion === '10') {
        kiboRegion = 'FL';
      } else if (additionalInfo.kiboRegion === '20') {
        kiboRegion = 'SF';
      } else if (additionalInfo.kiboRegion === '100') {
        kiboRegion = 'AT';
      } else if (additionalInfo.kiboRegion === '120') {
        kiboRegion = 'CA';
      } else if (additionalInfo.kiboRegion === '130') {
        kiboRegion = 'LI';
      } else if (additionalInfo.kiboRegion === '140') {
        kiboRegion = 'TE';
      } else if (additionalInfo.kiboRegion === '200') {
        kiboRegion = 'CH';
      } else { kiboRegion = ''; }

      if (additionalInfo.Size === 'V-SMALL') {
        Size = 'VS';
      } else if (additionalInfo.Size === 'SMALL') {
        Size = 'SM';
      } else if (additionalInfo.Size === 'MEDIUM') {
        Size = 'ME';
      } else if (additionalInfo.Size === 'LARGE') {
        Size = 'LG';
      } else if (additionalInfo.Size === 'HUGE') {
        Size = 'HG';
      } else { Size = ''; }

      if (additionalInfo.Industry) {
        Industry = additionalInfo.Industry;
      }
      return b2bAccount.addAccount({}, { body: payload })
        .then(res => {
          console.log('add account response 1', res.id);
          kiboAccountId = res.id.toString();
          const { id: accountId } = res;

          return b2bAccount.addSalesRep({
            accountId,
            userId: 'e0f6008ea91544a59b0d667406e372c2',
          });
        })
        .then(res => {
          console.log('add account response 2', res.id);
          const { id: accountId } = res;
          return b2bAccount.accountApprove({ accountId, status: 'deny' });
        })
        .then(res => {
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
            promises.push(b2bAccount.addB2BAccountAttribute(
              { accountId: res.id, attributeFQN: 'tenant~account_id' },
              {
                body: {
                  fullyQualifiedName: 'tenant~contact_id',
                  values: [contactId]
                }
              }
            ));
            promises.push(b2bAccount.addB2BAccountAttribute(
              { accountId: res.id, attributeFQN: 'tenant~account_id' },
              {
                body: {
                  fullyQualifiedName: 'tenant~ship_to_id',
                  values: [shipToId]
                }
              }
            ));
            promises.push(b2bAccount.addB2BAccountAttribute(
              { accountId: res.id, attributeFQN: 'tenant~account_id' },
              {
                body: {
                  fullyQualifiedName: 'tenant~terms_id',
                  values: [termsId]
                }
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
        .then(() => (
          {
            p21CustomerId: p21AccountId,
            kiboRegion: kiboRegion,
            industry: Industry,
            size: Size,
            kiboCustomerId: kiboAccountId,
            kiboCustomerEmailId: emailId,
            enable_flag: 'true'
          }
        ))
        .catch(err => {
          console.log(err.originalError.message);
          return new Error(err.originalError.message);
        });
    }
    return b2bAccount.addAccount({}, { body: payload })
      .then(res => {
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
      .then(() => new Promise(resolve => resolve('Successfully created Account')))
      .catch(err => {
        console.log(err.originalError.message);
        return new Error(err.originalError.message);
      });
  }
}

module.exports = B2BAccount;
