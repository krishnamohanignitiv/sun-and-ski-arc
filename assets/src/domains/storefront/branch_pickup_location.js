/* eslint-disable no-trailing-spaces */
/* eslint-disable max-len */
const ProductSDK = require('mozu-node-sdk/clients/commerce/catalog/storefront/product');
const LocationSDK = require('mozu-node-sdk/clients/commerce/location');
const Utilities = require('../../branch_pickup/branchPickupUtilities');

// response object should contain -> storeClosed, storeClosingTime ,fulfilledQuantity, transferQuantity, unfulfilledQuantity, pickuptransferdate, pickupdate, productCode
module.exports = context => {
  const dayArr = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  console.log(new Date());

  const { calculateTransferDate } = Utilities;
  const { calculatePickupDate } = Utilities;
  const { calculateClosingTime } = Utilities;
  const { extractAttributes } = Utilities;
  const { localStoreCode } = context.request.body;
  const { productCode } = context.request.body;
  const { quantity } = context.request.body;
  
  class ResponseObject {
    constructor(storeClosed, storeClosingTime, fulfilledQuantity, transferQuantity, unfulfilledQuantity, date, transferDate) {
      this.fulfilledDetails = { fulfilledQuantity: fulfilledQuantity, localPickupDate: date, time: storeClosingTime };
      this.transferDetails = { transferQuantity: transferQuantity, transferDate: transferDate };
      this.unfulfilledQuantity = unfulfilledQuantity;
      this.productCode = productCode;
      this.storeClosed = storeClosed;
    }
  }
  const productSDK = new ProductSDK(context);
  const locationSDK = new LocationSDK(context);
  productSDK.context['user-claims'] = null;
  locationSDK.context['user-claims'] = null;
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const options = {
    timeZone: 'EST',
    hour12: false,
  };
  productSDK
    .getProductInventory({
      productCode: productCode,
      locationCodes: localStoreCode,
    })
    .then(res => {
      if (res.totalCount > 0) {
        console.log(res.items[0].stockAvailable);
        if (res.items[0].stockAvailable >= quantity) {
          const localStoreStock = res.items[0].stockAvailable;
          console.log('Item Found in the local store');
          locationSDK
            .getLocation({
              locationCode: localStoreCode,
              includeAttributeDefinition: true,
            })
            .then(location => {
              // checking store closed day or not
              const storeClosed = location.regularHours[dayArr[currentDay]].isClosed;
              if (!storeClosed) {
                const closingTimeString = location.regularHours[dayArr[currentDay]].closeTime;
                const closingHours = parseInt(location.regularHours[dayArr[currentDay]].closeTime.substring(0, 2), 10);
                const closingMins = parseInt(location.regularHours[dayArr[currentDay]].closeTime.slice(-2), 10);
                console.log('closing params', closingHours, closingMins);
                const closingTime = calculateClosingTime(closingHours, closingMins);
                // localstore pickup possible
                context.response.body = new ResponseObject(storeClosed, closingTimeString, quantity, 0, 0, calculatePickupDate(closingTime), null);
              } else { // Closed Store
                const newDate = new Date(currentDate.setDate(currentDate.getDate() + 1)).toLocaleTimeString('en-US', {
                  timeZone: 'EST',
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                }).split(', ');
                context.response.body = new ResponseObject(storeClosed, null, quantity, 0, 0, newDate, null);
              }
              context.response.end();
            })
            .catch(err => {
              console.log(err, 'Errors');
              context.response.body = err.originalError.message;
              context.response.end();
            });
        } else {
          console.log('Item not found in local store');
          locationSDK
            .getLocation({
              locationCode: localStoreCode,
              includeAttributeDefinition: true,
            })
            .then(location => {
              // If store has a hub else it is a hub itself
              const localStoreStock = res.items[0].stockAvailable;
              const storeClosed = location.regularHours[dayArr[currentDay]].isClosed;
              const closingTimeString = location.regularHours[dayArr[currentDay]].closeTime;
              const closingHours = parseInt(location.regularHours[dayArr[currentDay]].closeTime.substring(0, 2), 10);
              const closingMins = parseInt(location.regularHours[dayArr[currentDay]].closeTime.slice(-2), 10);
              const closingTime = calculateClosingTime(closingHours, closingMins);
              if (location.attributes.length) {
                const attributes = extractAttributes(location.attributes);
                const { transferDay1 } = attributes;
                const { transferDay2 } = attributes;
                const { transferHours } = attributes;
                const { transferMins } = attributes;
                const { hubId } = attributes;
                console.log(extractAttributes(location.attributes));
                productSDK
                  .getProductInventory({
                    productCode: productCode,
                    locationCodes: hubId[0],
                  })
                  .then(hubInventory => {
                    const hubRequired = quantity - localStoreStock;
                    const hubStock = hubInventory.items[0].stockAvailable;
                    const transferTime = new Date(currentDate.toLocaleString('en-US', options));
                    transferTime.setHours(transferHours);
                    transferTime.setMinutes(transferMins);
                    transferTime.setSeconds(0);
                    if (hubInventory.totalCount > 0) {
                      // quantity to be changed to hubRequired
                      const transferDate = calculateTransferDate(transferDay1, transferDay2, currentDay, transferTime.getTime());
                      const pickupDate = localStoreStock !== 0 ? calculatePickupDate(closingTime) : null;
                      if (hubStock >= hubRequired) {
                        context.response.body = new ResponseObject(storeClosed, closingTimeString, localStoreStock, hubRequired, 0, pickupDate, transferDate);
                        context.response.end();
                      } else {
                        const unfulfilled = quantity - (hubStock + localStoreStock);
                        context.response.body = new ResponseObject(storeClosed, closingTimeString, localStoreStock, hubStock, unfulfilled, pickupDate, transferDate);
                        context.response.end();
                      }
                    }
                  })
                  .catch(err => {
                    console.log(err, 'Errors');
                    context.response.body = err.originalError.message;
                    context.response.end();
                  });
              } else {
                context.response.body = new ResponseObject(storeClosed, null, 0, 0, quantity, null, null);
                context.response.end();
              }
            })
            .catch(err => {
              console.log(err, 'Errors');
              context.response.body = err.originalError.message;
              context.response.end();
            });
        }
      } else {
        context.response.body = new ResponseObject(true, null, 0, 0, quantity, null, null);
        context.response.end();
      }
    })
    .catch(err => {
      console.log(err, 'Errors');
      context.response.body = err.originalError.message;
      context.response.end();
    });
};
// {
//   message: 'Item available for pickup in 2-4 weeks',
//   quantity: quantity,
//   condition: 7,
//   allowPickup: false
// };
