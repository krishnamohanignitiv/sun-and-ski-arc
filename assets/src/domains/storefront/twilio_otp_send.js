const Twilio = require('../../Twilio/twilio');

const twilio = new Twilio();

module.exports = function (context) {
  const { phnNumber } = context.request.body;
  twilio.smsOTPsend(phnNumber)
    .then(verification => {
      console.log(verification);
      const responseBody = {
        success: true,
        attempts: verification.sendCodeAttempts.length,
      };
      context.response.body = responseBody;
      context.response.end();
    })
    .catch(err => {
      console.log(err);
      context.response.status = err.status || 400;
      const responseBody = {
        success: false,
        message: err.message,
        status: err.status
      };
      context.response.body = responseBody;
      context.response.end();
    });
  // console.log('Hello World');
  // context.response.body = 'Hello World';
  // context.response.end();
};
