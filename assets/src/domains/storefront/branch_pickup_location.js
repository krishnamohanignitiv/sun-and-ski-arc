/* eslint-disable no-trailing-spaces */
/* eslint-disable max-len */
const ProductSDK = require('mozu-node-sdk/clients/commerce/catalog/storefront/product');
const LocationSDK = require('mozu-node-sdk/clients/commerce/location');
const Utilities = require('../../branch_pickup/branchPickupUtilities');

// response object should contain -> storeClosed, storeClosingTime ,fulfilledQuantity, transferQuantity, unfulfilledQuantity, pickuptransferdate, pickupdate, productCode
module.exports = context => {
  const productSDK = new ProductSDK(context);
  const locationSDK = new LocationSDK(context);
  productSDK.context['user-claims'] = null;
  locationSDK.context['user-claims'] = null;
  const dayArr = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const {
    calculateTransferDate, calculatePickupDate, calculateClosingTime, extractAttributes 
  } = Utilities;

  const { localStoreCode, productCode, quantity } = context.request.body;

  class ResponseObject {
    constructor(storeClosed, storeClosingTime, fulfilledQuantity, transferQuantity, unfulfilledQuantity, date, transferDate) {
      this.fulfilledDetails = { fulfilledQuantity: fulfilledQuantity, localPickupDate: date, time: storeClosingTime };
      this.transferDetails = { transferQuantity: transferQuantity, transferDate: transferDate };
      this.unfulfilledQuantity = unfulfilledQuantity;
      this.productCode = productCode;
      this.storeClosed = storeClosed;
    }
  }

  function fetchProductInventory(locationCode) {
    return productSDK.getProductInventory({
      productCode: productCode,
      locationCodes: locationCode
    });
  }

  function fetchLocation(locationCode) {
    return locationSDK
      .getLocation({
        locationCode: locationCode,
        includeAttributeDefinition: true,
      });
  }

  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const options = {
    timeZone: 'EST',
    hour12: false,
  };

  function main() {
    fetchProductInventory(localStoreCode).then(res => {
      console.log(res);
      if (res.totalCount > 0) {
        const localStoreStock = res.items[0].stockAvailable;
        if (localStoreStock >= quantity) {  
          console.log('Item Found in the local store');
          fetchLocation(localStoreCode).then(location => {
            // checking store closed day or not
            const storeClosed = location.regularHours[dayArr[currentDay]].isClosed;
            if (!storeClosed) {
              const closingTimeString = location.regularHours[dayArr[currentDay]].closeTime;
              const closingHours = parseInt(location.regularHours[dayArr[currentDay]].closeTime.slice(0, 2), 10);
              const closingMins = parseInt(location.regularHours[dayArr[currentDay]].closeTime.slice(-2), 10);
              const closingTime = calculateClosingTime(closingHours, closingMins);
              // localstore pickup possible
              context.response.body = new ResponseObject(storeClosed, closingTimeString, quantity, 0, 0, calculatePickupDate(closingTime), null);
            } else { // Closed Store
              let counter = 1;
              while (location.regularHours[dayArr[(currentDay + counter) % 7]].isClosed) {
                counter++;
              }
              const closingTimeString = location.regularHours[dayArr[(currentDay + counter) % 7]].closeTime;
              const newDate = new Date(currentDate.setDate(currentDate.getDate() + counter)).toLocaleTimeString('en-US', {
                timeZone: 'EST',
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
              }).split(', ');
              context.response.body = new ResponseObject(storeClosed, closingTimeString, quantity, 0, 0, newDate, null);
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
          fetchLocation(localStoreCode).then(location => {
            // If store has a hub else it is a hub itself
            const storeClosed = location.regularHours[dayArr[currentDay]].isClosed;
            console.log(storeClosed);
            let counter = 1;
            while (location.regularHours[dayArr[(currentDay + counter) % 7]].isClosed) {
              counter++;
            }
            let closingTimeString;
            let closingHours;
            let closingMins;
            let closingTime;
            if (!storeClosed) {
              closingTimeString = location.regularHours[dayArr[currentDay]].closeTime;
              closingHours = parseInt(closingTimeString.slice(0, 2), 10);
              closingMins = parseInt(closingTimeString.slice(-2), 10);
              closingTime = calculateClosingTime(closingHours, closingMins);
            } else {
              closingTimeString = location.regularHours[dayArr[(currentDay + counter) % 7]].closeTime;
            }
            if (location.attributes.length) {
              const attributes = extractAttributes(location.attributes);
              const {
                transferDay1, transferDay2, transferHours, transferMins, hubId 
              } = attributes;
              if (hubId && hubId.length !== 0) {
                fetchProductInventory(hubId[0]).then(hubInventory => {
                  const hubRequired = localStoreStock > 0 ? quantity - localStoreStock : quantity;
                  const hubStock = hubInventory.items[0].stockAvailable;
                  const transferTime = new Date(currentDate.toLocaleString('en-US', options));
                  transferTime.setHours(transferHours);
                  transferTime.setMinutes(transferMins);
                  transferTime.setSeconds(0);
                  if (hubInventory.totalCount > 0) {
                    // quantity to be changed to hubRequired
                    const transferDate = calculateTransferDate(transferDay1, transferDay2, currentDay, transferTime.getTime());
                    let pickupDate;
                    if (!storeClosed) pickupDate = localStoreStock !== 0 ? calculatePickupDate(closingTime) : null;
                    else {
                      pickupDate = new Date(currentDate.setDate(currentDate.getDate() + counter)).toLocaleTimeString('en-US', {
                        timeZone: 'EST',
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                      }).split(', ');
                    }
                    if (hubStock >= hubRequired) {
                      context.response.body = new ResponseObject(storeClosed, closingTimeString, localStoreStock, hubRequired, 0, pickupDate, transferDate);
                      context.response.end();
                    } else {
                      const unfulfilled = localStoreStock > 0 ? quantity - (hubStock + localStoreStock) : quantity - hubStock;
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
                console.log('its a hub');
                const unfulfilled = quantity - localStoreStock;
                const pickupDate = calculatePickupDate(closingTime);
                context.response.body = new ResponseObject(storeClosed, closingTimeString, localStoreStock, 0, unfulfilled, pickupDate, null);
                context.response.end();
              }
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
  }
  
  main();
};
