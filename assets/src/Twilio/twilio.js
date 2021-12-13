// const accountSid = 'AC260b9f814e747c9f528d70164e27dd9b';
// const authToken = '1d35d9c0aa7c89cf7d28a0c43f87305e';
// const client = require('twilio')(accountSid, authToken);

class TwilioController {
  // eslint-disable-next-line no-unused-vars
  smsOTPsend(phnNumber) {
    console.log('Hello World');
    // return client.verify.services('VAaf49f2af1ff3f84cebeed1eb11a6b15f')
    //   .verifications
    //   .create({ to: phnNumber, channel: 'sms' });
    // .then(verification => console.log(verification))
    // .catch(err => console.log(err));
  }
}

module.exports = TwilioController;
