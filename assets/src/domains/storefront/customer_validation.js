const request = require('requests');

module.exports = function (context) {
  async function customerValidation() {
    let response;
    await request('https://api.simpleapps.net/ecommerce/customers/100004?resource_list=all', {
      method: 'GET',
      headers: {
        'x-api-key': '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0',
        siteid: 'coastalone'
      }

    }).on('data', customervalidation => {
      response = customervalidation;
      console.log('Customer Data', customervalidation);
      // context.response.body = customervalidation;
      // context.response.end();
      // eslint-disable-next-line consistent-return
    }).on('end', err => {
      if (err) {
        // eslint-disable-next-line no-unused-vars
        response = err;
        return console.log('connection closed due to errors', err);
        // console.log('end');
        // callback();
      }
    });
    console.info('Initiating simpleappsapi and added customer data request');
    return response;
  }
  async function invoiceFunction() {
    let response;
    await request('https://api.simpleapps.net/ecommerce/invoices?resource_list=all&customer_id=100004&limit=5', {
      method: 'GET',
      headers: {
        'x-api-key': '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0',
        siteid: 'coastalone'
      }

    }).on('data', customervalidation => {
      response = customervalidation;
      console.log('Customer Data', customervalidation);
      // context.response.body = customervalidation;
      // context.response.end();
      // eslint-disable-next-line consistent-return
    }).on('end', err => {
      if (err) {
        // eslint-disable-next-line no-unused-vars
        response = err;
        return console.log('connection closed due to errors', err);
        // console.log('end');
        // callback();
      }
    });
    console.info('Initiating simpleappsapi and added customer data request');
    return response;
  }

  customerValidation().then(res => {
    const parseData = JSON.parse(JSON.parse(res));
    console.log(parseData);
    context.response.body = parseData;
  });

  // function invoiceFunction() {
  //   request('https://api.simpleapps.net/ecommerce/invoices?resource_list=all&customer_id=100004&limit=5', {
  //     method: 'GET',
  //     headers: {
  //       'x-api-key': '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0',
  //       siteid: 'coastalone'
  //     }

  //   })

  //     .on('data', chunk => {
  //       console.log('Invoice Data', chunk);
  //       context.response.body = chunk;
  //       context.response.end();
  //     })
  //     .on('end', err => {
  //       if (err) return console.log('connection closed due to errors', err);

  //       console.log('end');
  //       callback();
  //     });

  //   console.info('Initiating simpleappsapi and added Invoice data request');

  //   callback();

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
