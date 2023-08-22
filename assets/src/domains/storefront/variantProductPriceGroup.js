/* eslint-disable function-paren-newline */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable space-before-blocks */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
const ProductVariantClient = require('mozu-node-sdk/clients/commerce/catalog/admin/products/productVariation');
const ProductStorefrontClient = require('mozu-node-sdk/clients/commerce/catalog/storefront/product');

const swatchesPrefix = '//cdn-sb.mozu.com/27795-44431/cms/44431/files/';

module.exports = (ctx, cb) => {
  const productVariationClient = new ProductVariantClient(ctx);
  productVariationClient.context['user-claims'] = null;
  const productStorefrontClient = new ProductStorefrontClient(ctx);
  productStorefrontClient.context['user-claims'] = null;

  const aggregateVariationPrice = items => {
    const map = new Map();
    const arr = [];
    const msrpArr = new Set();

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
          msrpArr.add({ listPrice: key, msrp: item.fixedPrice.msrp });
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
    for (const k of msrpArr) {
      const c = arr.find(i => i.price === k.listPrice);
      c.msrp = k.msrp.toString();
    }
    return arr;
  };

  const colorPriceMap = productCode => {
    console.log('====== Variant Product Price Group Working =======');
    const { properties } = ctx.response.viewData.model;
    const isBundleProperty = properties.find(
      prop => prop.attributeFQN === 'tenant~isbundle'
    );
    const isBundleProduct =
      isBundleProperty && isBundleProperty.values[0].value;

    if (isBundleProduct) return false;

    return productVariationClient
      .getProductVariations({ productCode: productCode })
      .then(res => {
        const items = res.items.map(i => {
          console.log('variation response', i.variationProductCode);
          return {
            variationProductCode: i.variationProductCode,
            fixedPrice: i.fixedPrice,
            options: i.options,
          };
        });
        return aggregateVariationPrice(items);
      })
      .catch(e => {
        console.log(e);
        cb();
      });
  };

  const bundleProductsImage = () => {
    console.log('====== Bundle Product Image Working =======');

    const { options, properties } = ctx.response.viewData.model;
    const arr = [];
    const isBundleProperty = properties.find(
      prop => prop.attributeFQN === 'tenant~isbundle'
    );
    const isBundleProduct =
      isBundleProperty && isBundleProperty.values[0].value;
    console.log(isBundleProduct);
    if (isBundleProduct) {
      options.forEach(option => {
        console.log(option);
        const variationCode =
          option.values.length > 0 && option.values[0].value;
        if (variationCode) {
          const keyArr = variationCode.split('-');
          keyArr.pop();
          const key = keyArr.reduce((acc, ele) => (acc += `-${ele}`));
          console.log('pdt codes in bundle', key);
          if (key) arr.push(key);
        }
      });
      const promiseArr = [];
      arr.forEach(key => {
        promiseArr.push(
          productStorefrontClient.getProduct({ productCode: key })
        );
      });
      return Promise.all(promiseArr).then(res => res);
    }
    return false;
  };

  const main = () => {
    const { productCode, options } = ctx.response.viewData.model;
    const promiseArr = [];
    promiseArr.push(colorPriceMap(productCode));
    promiseArr.push(bundleProductsImage());
    Promise.all(promiseArr).then(res => {
      const [cm, bm] = res;
      // console.log('colormap ===> ', cm);
      // console.log('bundlemap ===> ', bm);
      if (cm) ctx.response.viewData.model.colorPriceMap = cm;
      // if not bundled product then no need to change model for bundle product
      if (!bm) cb();

      const bundleProductImageMap = [];
      bm.forEach((p, i) => {
        console.log('=======', p.productCode, '=======');
        const variationCodes = options[i].values.map(v => v.value);
        const variations = p.variations.filter(v =>
          variationCodes.includes(v.productCode)
        );
        const imageMap = p.properties.find(
          property => property.attributeFQN === 'tenant~product-image-map'
        );
        const colorImageMap = [];

        if (imageMap) {
          const imageMapArr = imageMap.values[0].stringValue.split('|');
          const arr = [];
          const m = new Map();

          imageMapArr.forEach(v => {
            const [key, value] = v.split(':');
            console.log(key, ':', value);
            arr.push({
              id: key,
              imageUrl: swatchesPrefix + value,
            });
          });

          console.log('=========options===========', options[i], '===========');

          variations.forEach(v => {
            const color = v.options.find(
              o => o.attributeFQN === 'tenant~color'
            );
            if (color && color.value) {
              const image = arr.find(a => a.id === color.value).imageUrl;
              v.imageUrl = image;
              if (!m.has(color.value)) m.set(color.value, image);
            }
          });

          console.log(
            '==============final variations===================',
            variations,
            '================set==============',
            m,
            '======================'
          );
          for (const [k, v] of m) {
            const obj = {
              colorCode: k,
              imageUrl: v,
            };
            colorImageMap.push(obj);
          }
        }

        console.log('==========size function============');
        const sizeMap = p.options.find(
          option => option.attributeFQN === 'tenant~size'
        );

        const variationSizes = [];
        variations.forEach(v =>
          v.options.forEach(o => {
            if (o.attributeFQN === 'tenant~size') variationSizes.push(o.value);
          })
        );
        console.log(
          '===================variationSizes===========',
          variationSizes,
          '======================'
        );

        const finalSizeMap = sizeMap.values.filter(s =>
          variationSizes.includes(s.value)
        );

        console.log(
          '===================finalSizeMap===========',
          finalSizeMap,
          '======================'
        );

        bundleProductImageMap.push({
          productCode: p.productCode,
          attributeFQN: options[i].attributeFQN,
          productName: options[i].attributeDetail.name,
          variations: variations.map(v => ({
            options: v.options.map(option => ({
              attributeFQN: option.attributeFQN,
              value: option.value,
            })),
            variationProductCode: v.productCode,
          })),
          sizeMap: finalSizeMap,
          colorImageMap: colorImageMap,
        });
      });

      ctx.response.viewData.model.bundleProductImageMap = bundleProductImageMap;
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
