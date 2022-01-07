const accountSid = 'AC826ca5988ab01691b65052d2ced72f60';
const authToken = '4266d7d489e38e4220888c1e3a6ee7d6';
const client = require('twilio')(accountSid, authToken);

const serviceId = 'VA8232d8575376a9273b94784f60f6b962';

class TwilioController {
  // eslint-disable-next-line no-unused-vars
  async smsOTPsend(phnNumber) {
    return client.verify.services(serviceId)
      .verifications
      .create({ to: phnNumber, channel: 'sms' });
    // .then(verification => console.log(verification))
    // .catch(err => console.log(err));
  }

  async otpVerify(phnNumber, enteredOTP) {
    return client.verify.services(serviceId)
      .verificationChecks
      .create({ to: phnNumber, code: enteredOTP });
    // .then(verification => console.log(verification))
    // .catch(err => console.log(err));
  }
}

module.exports = TwilioController;
