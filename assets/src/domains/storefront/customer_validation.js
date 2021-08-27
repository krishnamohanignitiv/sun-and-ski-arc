// const request = require('requests');
// const fetch1 = require('node-fetch');
const superagent = require('superagent');

module.exports = function (context) {
  // eslint-disable-next-line prefer-object-spread
  const payload = Object.assign({}, context.request.body);

  const requiredData = {};
  async function customerValidate() {
    return superagent
      .get(
        `https://api.simpleapps.net/ecommerce/customers/${payload.accountNumber}?resource_list=all`
      )
      .set('x-api-key', '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0')
      .set('siteid', 'coastalone');
  }
  async function invoiceValidate() {
    return superagent
      .get(
        `https://api.simpleapps.net/ecommerce/invoices?resource_list=all&customer_id=${payload.accountNumber}&limit=5`
      )
      .set('x-api-key', '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0')
      .set('siteid', 'coastalone');
  }
  customerValidate()
    // eslint-disable-next-line consistent-return
    .then(res => {
      requiredData.customerValidated = JSON.parse(res.text);
      // console.log(requiredData.customerValidated.data.customer_id);
      // console.log(requiredData.customerValidated.data.resources.customersBilltos[0].phys_postal_code);
      // console.log(payload.accountNumber);
      // console.log(payload.billingZip);
      // console.log(requiredData.customerValidated);
      // eslint-disable-next-line eqeqeq
      if ((requiredData.customerValidated.data.customer_id == payload.accountNumber)
        // eslint-disable-next-line eqeqeq
        && (requiredData.customerValidated.data.resources.customersBilltos[0].phys_postal_code == payload.billingZip)) {
        return invoiceValidate();
      }
      throw new Error('Account not validated for Customer Account');
    })
    // eslint-disable-next-line consistent-return
    .then(res => {
      requiredData.invoiceValidated = JSON.parse(res.text);
      const invoiceLength = requiredData.invoiceValidated.data.length - 1;
      // console.log(requiredData.invoiceValidated.data[invoiceLength].total_amount);
      // console.log(payload.lastInvoice);
      // eslint-disable-next-line eqeqeq
      if (requiredData.invoiceValidated.data[invoiceLength].total_amount == payload.lastInvoice) {
        context.response.body = requiredData;
        context.response.end();
        return;
      }
      throw new Error('Account not validated for Invoice Account');
    })
    .catch(err => {
      console.log(err);
      context.response.body = err.message;
      context.response.end();
    });
};
