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
    actionName: 'http.storefront.routes',
    customFunction: require('./domains/storefront/branch_pickup_location')
  },
  twilio_otpSend: {
    actionName: 'http.storefront.routes',
    customFunction: require('./domains/storefront/twilio_otp_send')
  },
  twilio_otpVerify: {
    actionName: 'http.storefront.routes',
    customFunction: require('./domains/storefront/twilio_otp_verify')
  },
  productSurcharge: {
    actionName: 'http.commerce.catalog.storefront.products.getProduct.after',
    customFunction: require('./domains/storefront/productSurcharge')
  },
  getAllCategories: {
    actionName: 'http.storefront.routes',
    customFunction: require('./domains/storefront/getAllCategories')
  }
  // twilo_otp_send: {
  //   actionName: 'http.storefront.routes',
  //   customFunction: require('./domains/storefront/twilio_otp_send')
  // },
  // twilo_otp_verify: {
  //   actionName: 'http.storefront.routes',
  //   customFunction: require('./domains/storefront/twilio_otp_verify')
  // }
};
