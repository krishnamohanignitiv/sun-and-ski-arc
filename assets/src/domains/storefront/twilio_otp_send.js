const Twilio = require('../../Twilio/twilio');

const twilio = new Twilio();

module.exports = function (context) {
  const { phnNumber } = context.request.body;
  twilio.smsOTPsend(phnNumber)
    .then(verification => {
      console.log(verification);
      context.response.body = 'success';
      context.response.end();
    })
    .catch(err => {
      console.log(err);
      context.response.status = err.status || 400;
      context.response.body = err;
      context.response.end();
    });
  // console.log('Hello World');
  // context.response.body = 'Hello World';
  // context.response.end();
};
