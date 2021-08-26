/* eslint-disable global-require */
module.exports = {
  customer_validation: {
    actionName: 'http.storefront.routes',
    customFunction: require('./domains/storefront/customer_validation'),
  },
  b2b_user_creation: {
    actionName: 'http.storefront.routes',
    customFunction: require('./domains/storefront/b2b_user_creation'),
  },
};
