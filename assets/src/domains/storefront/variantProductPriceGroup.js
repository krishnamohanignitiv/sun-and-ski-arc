/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
const ProductVariantClient = require('mozu-node-sdk/clients/commerce/catalog/admin/products/productVariation');
const ProductStorefrontClient = require('mozu-node-sdk/clients/commerce/catalog/storefront/product');

module.exports = (ctx, cb) => {
  const productVariationClient = new ProductVariantClient(ctx);
  productVariationClient.context['user-claims'] = null;
  const productStorefrontClient = new ProductStorefrontClient(ctx);
  productStorefrontClient.context['user-claims'] = null;
  console.log('====== Variant Product Price Group Working =======');

  const aggregateVariationPrice = items => {
    const map = new Map();
    const arr = [];

    items.forEach(item => {
      if (item.fixedPrice) {
        const key = item.fixedPrice.listPrice.toString();
        if (map.has(key)) {
          const colorCode = item.options.find(
            o => o.attributeFQN === 'tenant~color'
          ).value;
          const newArr = map.get(key);
          if (!newArr.find(i => i === colorCode)) {
            newArr.push(colorCode);
          }
        } else {
          const newArr = [];
          const colorCode = item.options.find(
            o => o.attributeFQN === 'tenant~color'
          ).value;
          newArr.push(colorCode);
          map.set(key, newArr);
        }
      }
    });
    for (const [k, v] of map) {
      const obj = {
        price: k,
        colorCodes: v,
      };
      arr.push(obj);
    }
    return arr;
  };
  const bundleProductsImage = () => {
    const { productUsage, options } = ctx.response.viewData.model;
    const map = new Map();
    const arr = [];
    if (productUsage === 'Bundle') {
      console.log(options[1].values[0].value.split('-')[0]);
      options.forEach(option => {
        const key = option.values[0].value.split('-')[0];
        arr.push(key);
      });
      const promiseArr = [];
      arr.forEach(key => {
        promiseArr.push(
          productStorefrontClient.getProduct({ productCode: key })
        );
      });
    } else {
      console.log('no work need to be done');
    }
  };

  const main = () => {
    const { productCode } = ctx.response.viewData.model;
    bundleProductsImage();
    productVariationClient
      .getProductVariations({ productCode: productCode })
      .then(res => {
        const items = res.items.map(i => ({
          variationProductCode: i.variationProductCode,
          fixedPrice: i.fixedPrice,
          options: i.options,
        }));
        const aggregatedMap = aggregateVariationPrice(items);
        console.log(aggregatedMap);
        ctx.response.viewData.model.colorPriceMap = aggregatedMap;
        cb();
      })
      .catch(e => {
        console.log(e);
        cb();
      });
  };

  try {
    main();
  } catch (e) {
    console.log(e);
    cb();
  }
};
