const ProductExtrasSDK = require('mozu-node-sdk/clients/commerce/catalog/admin/products/productExtra');
const EntitySDK = require('mozu-node-sdk/clients/platform/entitylists/entity');

module.exports = (context, callback) => {
  const productExtrasSDK = new ProductExtrasSDK(context);
  const entitySDK = new EntitySDK(context);
  productExtrasSDK.context['user-claims'] = null;
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
    return price * (surcharge / 100);
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
    const responseBody = context.response.body;
    const { price } = responseBody;
    const { properties } = responseBody;
    const productPrice = price.salePrice && price.salePrice !== 0
      ? price.salePrice : price.price;
    const surchargeObject = fetchSurchargeValue(properties);
    console.log(surchargeObject);
    if (surchargeObject === null) {
      callback();
    }
    surchargeObject.then(res => {
      const { surchargeValue } = res;
      const newSurchargeValue = calculateSurcharge(productPrice, surchargeValue);
      updateExtras(productCode, newSurchargeValue).then(() => {
        callback();
      });
    });
  }
  main();
};
