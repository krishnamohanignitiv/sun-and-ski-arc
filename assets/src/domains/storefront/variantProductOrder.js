/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
const ProductSDK = require('mozu-node-sdk/clients/commerce/catalog/storefront/product');

module.exports = (context, callback) => {
  const productSdk = new ProductSDK(context);
  productSdk.context['user-claims'] = null;
  function main() {
    const { request, response } = context;
    console.log('running variant product order');
    if (response.body.productUsage === 'Configurable') {
      console.log('configurable product');
      const { variations } = response.body;
      const variantionCodes = [];
      variations.forEach(v => {
        variantionCodes.push(v.productCode);
      });
      const locationCodes = ['100', '10'];
      console.info('productCodes', variantionCodes);
      console.log('locationCodes', locationCodes);
      productSdk.getProductInventories({}, {
        body: {
          locationCodes: locationCodes,
          productCodes: variantionCodes
        }
      })
        .then(res => {
          console.log(res);
          if (res.totalCount === 0) {
            console.log('------No Inventory Found------');
            callback();
          } else {
            console.log('-----Inventory Found------');
            const m = new Map();
            variantionCodes.forEach(v => {
              m.set(v, 0);
            });
            res.items.forEach(i => {
              const c = m.get(i.productCode);
              m.set(i.productCode, c + i.stockAvailable);
            });
            console.log(m);
            const orderedVariationCode = [];
            for (const [k, v] of m.entries()) {
              if (v > 0) {
                orderedVariationCode.unshift(k);
              } else {
                orderedVariationCode.push(k);
              }
            }
            console.log('ordered variant codes', orderedVariationCode);
            const finalArray = [];
            orderedVariationCode.forEach(v => {
              const variantProduct = variations.find(variant => variant.productCode === v);
              finalArray.push(variantProduct);
            });
            console.log('--------final variant array------- \n', finalArray);
            const finalColorArray = [];
            const finalSizeArray = [];
            const finalTypeArray = [];
            finalArray.forEach(f => {
              const color = f.options.find(o => o.attributeFQN === 'tenant~colorvariant');
              const size = f.options.find(o => o.attributeFQN === 'tenant~size');
              const type = f.options.find(o => o.attributeFQN === 'tenant~type');
              if (color) {
                const productOptions = response.body.options.find(o => o.attributeFQN === 'tenant~colorvariant').values;
                const currentOption = productOptions.find(o => o.value === color.value);
                finalColorArray.push(currentOption);
              }
              if (size) {
                const productOptions = response.body.options.find(o => o.attributeFQN === 'tenant~size').values;
                const currentOption = productOptions.find(o => o.value === size.value);
                finalSizeArray.push(currentOption);
              }
              if (type) {
                const productOptions = response.body.options.find(o => o.attributeFQN === 'tenant~type').values;
                const currentOption = productOptions.find(o => o.value === type.value);
                finalTypeArray.push(currentOption);
              }
            });
            console.log('final color array, final size array, final type array \n', finalColorArray, finalSizeArray, finalTypeArray);
            if (finalColorArray.length > 0) response.body.options.find(o => o.attributeFQN === 'tenant~colorvariant').values = finalColorArray;
            if (finalSizeArray.length > 0) response.body.options.find(o => o.attributeFQN === 'tenant~size').values = finalSizeArray;
            if (finalTypeArray.length > 0) response.body.options.find(o => o.attributeFQN === 'tenant~type').values = finalTypeArray;
            response.body.variations = finalArray;
            context.response.body = response.body;
            context.response.end();
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      console.log('non-configurable product');
      callback();
    }
  }
  main();
};
