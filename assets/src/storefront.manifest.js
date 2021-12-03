/* eslint-disable global-require */
// const PriceList = require('./domains/storefront/priceListChange');

module.exports = {
  customer_validation: {
    actionName: 'http.storefront.routes',
    customFunction: require('./domains/storefront/customer_validation'),
    // customRoute: 'coastal/api/customers/customer_validation',
  },
  b2b_user_creation: {
    actionName: 'http.storefront.routes',
    customFunction: require('./domains/storefront/b2b_user_creation'),
    // customRoute: 'coastal/api/commerce/customer/b2baccounts',
  },
  priceListChange: {
    actionName: 'http.storefront.routes',
    customFunction: require('./domains/storefront/priceListChange')
  },
  branch_pickup_location: {
    actionName: 'branch_pickup_location',
    customFunction: require('./domains/storefront/branch_pickup_location')
  }
};
