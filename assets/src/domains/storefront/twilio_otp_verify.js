const Twilio = require('../../Twilio/twilio');

const twilio = new Twilio();

module.exports = function (context) {
  const { phnNumber, enteredOTP } = context.request.body;

  twilio.otpVerify(phnNumber, enteredOTP)
    .then(verification => {
      if (verification.valid === false) throw new Error('Value did not match!!');
      context.response.body = 'success';
      context.response.end();
    })
    .catch(err => {
      console.log(err);
      context.response.status = 400;
      context.response.body = err.message || err;
      context.response.end();
    });
};
