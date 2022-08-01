const Client = require('mozu-node-sdk/clients/platform/application');
const B2BAccount = require('../../utilities/b2bAccountCreationPipeline');
// const B2bAccountSDK = require('../../../resources/b2bAccount');
const B2bAccountCreate = new B2BAccount();

module.exports = function (context) {
  const payload = Object.assign({}, context.request.body.payload); // eslint-disable-line prefer-object-spread
  const clientContext = new Client();
  B2bAccountCreate.b2bAccountflow(clientContext, payload)
    .then(res => {
      console.log(res);
      if (res instanceof Error) {
        return Promise.reject(res);
      }
      return Promise.resolve();
    })
    .then(() => {
      // console.log(res);
      // context.response.status = 201;
      context.response.body = 'Successfully Created Account';
      context.response.end();
    })
    .catch(err => {
      context.response.status = 400;
      context.response.body = err.message;
      context.response.end();
    });
  // .catch(err => {
  //   console.log(err.originalError.message);
  //   const newErr = new Error(err.originalError.message);
  //   context.response.status = 400;
  //   context.response.body = newErr.message;
  //   context.response.end();
  // });
};
