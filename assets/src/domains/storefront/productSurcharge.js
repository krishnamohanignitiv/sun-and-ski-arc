const ProductSDK = require('mozu-node-sdk/clients/commerce/catalog/admin/product');
const ProductExtrasSDK = require('mozu-node-sdk/clients/commerce/catalog/admin/products/productExtra');
const ProductStorefrontSDK = require('mozu-node-sdk/clients/commerce/catalog/storefront/product');
const EntitySDK = require('mozu-node-sdk/clients/platform/entitylists/entity');

module.exports = (context, callback) => {
  const productSDK = new ProductSDK(context);
  const productExtrasSDK = new ProductExtrasSDK(context);
  const productStorefrontSDK = new ProductStorefrontSDK(context);
  const entitySDK = new EntitySDK(context);
  productSDK.context['user-claims'] = null;
  productExtrasSDK.context['user-claims'] = null;
  productStorefrontSDK.context['user-claims'] = null;
  entitySDK.context['user-claims'] = null;

  const entityListFullName = 'surchargeproductlist@coscon';
  function getEntityList(entitytyId) {
    return entitySDK.getEntity({ entityListFullName: entityListFullName, id: entitytyId });
  }

  function createPayload(newValue) {
    return {
      attributeFQN: 'tenant~surcharge',
      values: [
        {
          deltaPrice: {
            deltaPrice: newValue
          }
        }
      ]
    };
  }

  function fetchSurchargeValue(properties) {
    const property = properties.filter(prop => prop.attributeFQN === 'tenant~surchargeproductcode');
    const surchargeProductCode = property.length > 0 ? property[0].values[0].value : null;
    if (surchargeProductCode === null) return null;
    return getEntityList(surchargeProductCode);
  }

  function calculateSurcharge(price, surcharge) {
    console.log(surcharge, price);
    return price * (surcharge / 100);
  }

  function getProduct(productCode) {
    return productSDK.getProduct({
      productCode: productCode
    });
  }

  function updateExtras(productCode, newValue) {
    const payload = createPayload(newValue);
    return productExtrasSDK.updateExtra({
      productCode: productCode,
      attributeFQN: 'tenant~surcharge'
    }, { body: payload });
  }

  function main() {
    const { productCode } = context.request.params;
    getProduct(productCode).then(product => {
      const productPrice = product.price.salePrice && product.price.salePrice !== 0
        ? product.price.salePrice : product.price.price;
      const { properties } = product;
      const surchargeObject = fetchSurchargeValue(properties);
      if (surchargeObject === null) {
        callback();
      }
      surchargeObject.then(res => {
        const { surchargeValue } = res;
        console.log(surchargeValue);
        const newSurchargeValue = calculateSurcharge(productPrice, surchargeValue);
        updateExtras(productCode, newSurchargeValue).then(() => {
          callback();
        });
      });
    });
  }
  main();
};
