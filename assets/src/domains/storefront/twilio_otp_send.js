// eslint-disable-next-line no-unused-vars
const Twilio = require('../../Twilio/twilio');

module.exports = function (context) {
  // const { phnNumber } = context.request.body;
  // Twilio.smsOTPsend(phnNumber)
  //   .then(verification => {
  //     console.log(verification);
  //     context.response.body = 'success';
  //     context.response.end();
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     // context.response.status = 400;
  //     context.response.body = err;
  //     context.response.end();
  //   });

  context.response.body = 'Hello World';
  context.response.end();
};
