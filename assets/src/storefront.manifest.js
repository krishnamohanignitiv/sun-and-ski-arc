/* eslint-disable global-require */

module.exports = {
  variantProductPriceGroup: {
    actionName: 'http.storefront.pages.productDetails.request.after',
    customFunction: require('./domains/storefront/variantProductPriceGroup'),
  },
};
