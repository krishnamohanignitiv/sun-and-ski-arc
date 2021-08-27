// const request = require('requests');
// const fetch1 = require('node-fetch');
const superagent = require('superagent');

module.exports = function (context, callback) {
  const requiredData = {};
  async function customerValidate() {
    return superagent
      .get(
        'https://api.simpleapps.net/ecommerce/customers/100004?resource_list=all'
      )
      .set('x-api-key', '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0')
      .set('siteid', 'coastalone');
  }
  async function invoiceValidate() {
    return superagent
      .get(
        'https://api.simpleapps.net/ecommerce/invoices?resource_list=all&customer_id=100004&limit=5'
      )
      .set('x-api-key', '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0')
      .set('siteid', 'coastalone');
  }
  customerValidate()
    .then(res => {
      requiredData.customerValidated = JSON.parse(res.text);
      return invoiceValidate();
    })
    .then(res => {
      requiredData.invoiceValidated = JSON.parse(res.text);
      context.response.body = requiredData;
      context.response.end();
    })
    .catch(err => {
      console.log(err);
      callback();
    });
  // request(
  //   'https://api.simpleapps.net/ecommerce/invoices?resource_list=all&customer_id=100004&limit=5',
  //   {
  //     method: 'GET',
  //     headers: {
  //       'x-api-key': '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0',
  //       siteid: 'coastalone',
  //     },
  //   }
  // )
  //   .on('data', customervalidation => {
  //     console.log('Customer Data', customervalidation);
  //     context.response.body = customervalidation;
  //     context.response.end();
  //     // eslint-disable-next-line consistent-return
  //   })
  //   .on('end', err => {
  //     if (err) return console.log('connection closed due to errors', err);
  //     console.log('end');
  //     callback();
  //   });

  // console.info('Initiating simpleappsapi and added customer data request');

  // //Invoice

  // request('https://api.simpleapps.net/ecommerce/invoices?resource_list=all&customer_id=100004&limit=5', {
  //     method: 'GET',
  //     headers: {
  //       'x-api-key': '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0',
  //       'siteid': 'coastalone'
  //     }

  //   })

  //   .on('data', function (chunk) {
  //     console.log("Invoice Data", chunk);
  //     context.response.body = chunk;
  //     context.response.end();
  //   })
  //   .on('end', function (err) {
  //     if (err) return console.log('connection closed due to errors', err);

  //     console.log('end');
  //     callback();
  //   });

  // console.info('Initiating simpleappsapi and added Invoice data request');

  // callback();
};
