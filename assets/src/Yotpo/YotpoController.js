/* eslint-disable no-unused-vars */
const superagent = require('superagent');
const Client = require('mozu-node-sdk/clients/platform/application');

class YotpoController {
  async createOrder(payload) {
    const response = await superagent
      .post('https://api.yotpo.com/core/v3/stores/nCDyz6kmkjSpnUisjmeG3kunobKNEDGTN1fB8xlR/orders')
      .set('X-Yotpo-Token', 'RPFUpHShGSfUfRQNiTmVyacIJB7brk4penL0cmWK')
      .send(payload);
    return response;
  }
}

module.exports = YotpoController;
