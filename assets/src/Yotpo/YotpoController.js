/* eslint-disable no-unused-vars */
const superagent = require('superagent');
const Client = require('mozu-node-sdk/clients/platform/application');

class YotpoController {
  constructor() {
    this.yotpoOrderId = '';
  }

  createOrder(payload) {
    return superagent
      .post(
        'https://api.yotpo.com/core/v3/stores/nCDyz6kmkjSpnUisjmeG3kunobKNEDGTN1fB8xlR/orders'
      )
      .set('X-Yotpo-Token', 'RPFUpHShGSfUfRQNiTmVyacIJB7brk4penL0cmWK')
      .set('Content-Type', 'application/json')
      .send(payload)
      .then(res => {
        this.yotpoOrderId = res.body.order.yotpo_id;
        console.log(this.yotpoOrderId);
        return res.body;
      })
      .catch(err => {
        throw new Error(err.response.body.errors[0].message);
      });
  }
}

module.exports = YotpoController;
