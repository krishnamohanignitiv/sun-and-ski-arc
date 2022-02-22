/* eslint-disable max-len */
const ProductSDK = require('mozu-node-sdk/clients/commerce/catalog/storefront/product');
const LocationSDK = require('mozu-node-sdk/clients/commerce/location');
const Utilities = require('../../branch_pickup/branchPickupUtilities');

// response object should contain -> storeClosed, fulfilledQuantity, transferQuantity, unfulfilledQuantity, pickuptransferdate, pickupdate, productCode
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
  const { localStoreCode } = context.request.body;
  const { productCode } = context.request.body;
  const { quantity } = context.request.body;
  class ResponseObject {
    constructor(storeClosed, fulfilledQuantity, transferQuantity, unfulfilledQuantity, date, transferDate) {
      this.fulfilledDetails = { fulfilledQuantity: fulfilledQuantity, localPickupDate: date };
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
  // const currentTime = new Date(currentDate.toLocaleString('en-US', options));
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
                // checking if store is closing before 1 hour
                let closingTime;
                // let localTime;
                if (currentDate.toLocaleString('en-US', options).split(', ')[1].split(':')[0] === '24') {
                  // localTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'EST', hour12: false }).replace('24', '00'));
                  closingTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'EST', hour12: false }).replace('24', '00'));
                } else {
                  closingTime = new Date(currentDate.toLocaleString('en-US', options));
                }
                const closingHours = parseInt(location.regularHours[dayArr[currentDay]].closeTime.substring(0, 2), 10);
                const closingMins = parseInt(location.regularHours[dayArr[currentDay]].closeTime.slice(-2), 10);
                closingTime.setHours(closingHours);
                closingTime.setMinutes(closingMins);
                closingTime.setSeconds(0);
                // Same Day Pickup
                if (closingTime.getTime() - new Date().getTime() >= 3600000) {
                  // let orderBefore = closingHours - 1;
                  // let noon = 'AM';
                  // if (orderBefore > 12) {
                  //   noon = 'PM';
                  //   orderBefore -= 12;
                  // }
                  // const formattedToday = currentDate.toLocaleTimeString('en-US', {
                  //   timeZone: 'EST',
                  //   day: 'numeric',
                  //   month: 'numeric',
                  //   year: 'numeric',
                  //   hour12: true,
                  // }).split(', ');
                  console.log(calculatePickupDate(closingTime.getTime()));
                  context.response.body = new ResponseObject(storeClosed, localStoreStock, 0, 0, new Date(), null);
                } else { // next Day Pickup
                  const newDate = new Date(currentDate.setDate(currentDate.getDate() + 1)).toLocaleTimeString('en-US', {
                    timeZone: 'EST',
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                  }).split(', ');
                  console.log('date calculation function', calculatePickupDate(closingTime.getTime()));
                  context.response.body = new ResponseObject(storeClosed, localStoreStock, 0, 0, newDate, null);
                }
              } else { // Closed Store
                const newDate = new Date(currentDate.setDate(currentDate.getDate() + 1)).toLocaleTimeString('en-US', {
                  timeZone: 'EST',
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                }).split(', ');
                context.response.body = new ResponseObject(storeClosed, quantity, 0, 0, newDate, null);
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
              console.log(localStoreStock, storeClosed);
              if (location.attributes.length) {
                let transferDay1;
                let transferDay2;
                let transferHours;
                let transferMins;
                let hubId;
                for (let i = 0; i < location.attributes.length; i++) {
                  if (location.attributes[i].attributeDefinition.attributeCode === 'transfer-day-2') {
                    transferDay2 = dayArr.indexOf(
                      location.attributes[i].values[0].toLowerCase()
                    );
                  }
                  if (location.attributes[i].attributeDefinition.attributeCode === 'transfer-day-1') {
                    transferDay1 = dayArr.indexOf(
                      location.attributes[i].values[0].toLowerCase()
                    );
                  }
                  if (location.attributes[i].attributeDefinition.attributeCode === 'hub-id') {
                    hubId = location.attributes[i].values;
                  }
                  if (location.attributes[i].attributeDefinition.attributeCode === 'transfer-time') {
                    const transferTime = location.attributes[i].values[0].toString();
                    transferHours = transferTime.length === 3 ? transferTime.substring(0, 1) : transferTime.substring(0, 2);
                    transferHours = parseInt(transferHours, 10);
                    transferMins = parseInt(transferTime.substring(2), 10);
                  }
                }
                productSDK
                  .getProductInventory({
                    productCode: productCode,
                    locationCodes: hubId[0],
                  })
                  .then(hubInventory => {
                    const hubRequired = quantity - localStoreStock;
                    const hubStock = hubInventory.items[0].stockAvailable;
                    console.log('required from hub', hubRequired, 'available in hub', hubStock);
                    const transferTime = new Date(currentDate.toLocaleString('en-US', options));
                    transferTime.setHours(transferHours);
                    transferTime.setMinutes(transferMins);
                    transferTime.setSeconds(0);
                    if (hubInventory.totalCount > 0) {
                      // quantity to be changed to hubRequired
                      if (hubStock >= hubRequired) {
                        // let formattedPickupDate;
                        // let pickupDate;
                        // // if today is the transfer day
                        // if (
                        //   currentDay === transferDay1 || currentDay === transferDay2) {
                        //   // if current time is less than the transfer time
                        //   if (currentTime.getTime() < transferTime.getTime()) {
                        //     context.response.body = new ResponseObject(storeClosed, localStoreStock, hubRequired, 0, new Date(), new Date(new Date().setDate(new Date().getDate() + 1)));
                        //     // {
                        //     //   message:
                        //     //     'Available to pick up in 1 - 2 Business Days',
                        //     //   date: new Date(currentDate.setDate(currentDate.getDate() + 1)).toLocaleTimeString('en-US', {
                        //     //     timeZone: 'EST',
                        //     //     day: 'numeric',
                        //     //     month: 'numeric',
                        //     //     year: 'numeric',
                        //     //     hour12: true,
                        //     //   }).split(', '),
                        //     //   allowPickup: true,
                        //     //   condition: 9
                        //     // };
                        //   } else {
                        //     // If current time has crossed transfer time
                        //     const nearestNextPickupDay = calculateTransferDate(transferDay1, transferDay2, currentDay);
                        //     pickupDate = new Date(
                        //       currentDate.getFullYear(),
                        //       currentDate.getMonth(),
                        //       currentDate.getDate() + nearestNextPickupDay
                        //     );
                        //     formattedPickupDate = pickupDate.toLocaleTimeString('en-US', {
                        //       timeZone: 'EST',
                        //       day: 'numeric',
                        //       month: 'numeric',
                        //       year: 'numeric',
                        //       hour12: true,
                        //     }).split(', ');
                        //     console.log(pickupDate, formattedPickupDate);
                        //     const formattedMonth = formattedPickupDate[0].split('/')[0];
                        //     const formattedDate = formattedPickupDate[0].split('/')[1];
                        //     console.log(formattedDate, formattedMonth);
                        //     context.response.body = new ResponseObject(storeClosed, localStoreStock, hubRequired, 0, new Date(), formattedPickupDate);
                        //     // {
                        //     //   message:
                        //     //   `Avaiable for pickup on ${formattedMonth}/${formattedDate}`,
                        //     //   date: formattedPickupDate,
                        //     //   quantity: quantity,
                        //     //   allowPickup: true,
                        //     //   condition: 4
                        //     // };
                        //   }
                        // } else {
                        //   // If today is not a transfer day
                        //   const nearestNextTransferDay = calculateTransferDate(transferDay1, transferDay2, currentDate);
                        //   // currentDay - transferDay1 > 0
                        //   //   ? transferDay2 - currentDay + 2
                        //   //   : transferDay1 - currentDay + 2;
                        //   // if (currentDay < transferDay1) {
                        //   //   nearestNextTransferDay = transferDay1 - currentDay + 2;
                        //   // } else if (currentDay < transferDay2) {
                        //   //   nearestNextTransferDay = transferDay2 - currentDay + 2;
                        //   // } else {
                        //   //   nearestNextTransferDay = transferDay1 - currentDay + 9;
                        //   // }
                        //   console.log(nearestNextTransferDay, transferDay1, transferDay2, currentDay);
                        //   pickupDate = new Date(
                        //     currentDate.getFullYear(),
                        //     currentDate.getMonth(),
                        //     currentDate.getDate() + nearestNextTransferDay
                        //   );
                        //   console.log(pickupDate);
                        //   formattedPickupDate = pickupDate.toLocaleTimeString('en-US', {
                        //     timeZone: 'EST',
                        //     day: 'numeric',
                        //     month: 'numeric',
                        //     year: 'numeric',
                        //     hour12: true,
                        //   }).split(', ');
                        //   console.log(formattedPickupDate[0].split('/'));
                        //   // const formattedMonth = formattedPickupDate[0].split('/')[0];
                        //   // const formattedDate = formattedPickupDate[0].split('/')[1];
                        //   context.response.body = new ResponseObject(storeClosed, localStoreStock, hubRequired, 0, new Date(), formattedPickupDate);
                        //   // {
                        //   //   message:
                        //   //     `Avaiable for pickup on ${formattedMonth}/${formattedDate}`,
                        //   //   date: formattedPickupDate,
                        //   //   quantity: quantity,
                        //   //   condition: 5,
                        //   //   allowPickup: true
                        //   // };
                        // }
                        context.response.body = new ResponseObject(storeClosed, localStoreStock, hubRequired, 0, new Date(), calculateTransferDate(transferDay1, transferDay2, currentDay, transferTime.getTime()));
                        context.response.end();
                      } else {
                        const unfulfilled = quantity - (hubStock + localStoreStock);
                        const transferDate = calculateTransferDate(transferDay1, transferDay2, currentDay, transferTime.getTime());
                        // console.log('unfulfilled quantity', unfulfilled, transferDay1, transferDay2, currentDay);
                        // const transferDate = new Date(new Date().setDate(new Date().getDate() + calculateTransferDate(transferDay1, transferDay2, currentDay)));
                        context.response.body = new ResponseObject(storeClosed, localStoreStock, hubStock, unfulfilled, null, transferDate);
                        // {
                        //   message: 'Item available for pickup in 2-4 weeks',
                        //   quantity: quantity,
                        //   condition: 6,
                        //   allowPickup: false
                        // };
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
                context.response.body = new ResponseObject(storeClosed, 0, 0, quantity, null, null);
                // {
                //   message: 'Item available for pickup in 2-4 weeks',
                //   quantity: quantity,
                //   condition: 7,
                //   allowPickup: false
                // };
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
        context.response.body = new ResponseObject(true, 0, 0, quantity, null, null);
        // {
        //   message: 'Item available for pickup in 2-4 weeks',
        //   quantity: quantity,
        //   condition: 0,
        //   allowPickup: false
        // };
        context.response.end();
      }
    })
    .catch(err => {
      console.log(err, 'Errors');
      context.response.body = err.originalError.message;
      context.response.end();
    });
};
