/**
 * Implementation for http.storefront.routes


 * HTTP Actions all receive a similar context object that includes
 * `request` and `response` objects. These objects are similar to
 * http.IncomingMessage objects in NodeJS.

{
  configuration: {},
  request: http.ClientRequest,
  response: http.ClientResponse
}

 * Call `response.end()` to end the response early.
 * Call `response.set(headerName)` to set an HTTP header for the response.
 * `request.headers` is an object containing the HTTP headers for the request.
 * 
 * The `request` and `response` objects are both Streams and you can read
 * data out of them the way that you would in Node.

 */

const request = require('requests');

module.exports = function (context, callback) {

  request('https://api.simpleapps.net/ecommerce/customers/100004?resource_list=all', {
    method: 'GET',
    headers: {
      'x-api-key': '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0',
      'siteid': 'coastalone'
    }

  }).on('data', function (customervalidation) {
    console.log("Customer Data", customervalidation);
    context.response.body = customervalidation;
    context.response.end();

    request('https://api.simpleapps.net/ecommerce/invoices?resource_list=all&customer_id=100004&limit=5', {
        method: 'GET',
        headers: {
          'x-api-key': '020A1B0AD2E19A2C13931F6744BC52C096FF5BB0',
          'siteid': 'coastalone'
        }

      }).on('data', function (invoicevalidation) {
        console.log("Invoice Data", invoicevalidation);
        context.response.body = invoicevalidation;
        context.response.end();
      })
      .on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err);

        console.log('end');
        callback();
      });

    
  }).on('end', function (err) {
    if (err) return console.log('connection closed due to errors', err);

    console.log('end');
    callback();
  });


  console.info('Initiating simpleappsapi and added customer data request');



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


  //callback();
};