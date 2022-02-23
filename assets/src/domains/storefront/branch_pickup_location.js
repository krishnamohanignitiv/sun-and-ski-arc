/* eslint-disable indent */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
const ProductSDK = require('mozu-node-sdk/clients/commerce/catalog/storefront/product');
const LocationSDK = require('mozu-node-sdk/clients/commerce/location');

module.exports = context => {
  // context.response.body = "Hello World";

  const dayArr = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  // var transferDays = ['wednesday', 'saturday'];
  // var pageURL = context.request.url;
  const { localStoreCode } = context.request.body;
  const { productCode } = context.request.body;
  const { quantity } = context.request.body;
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
  console.log(currentDate.toLocaleTimeString('en-US', options));
  const currentUserHours = currentDate
    .toLocaleTimeString('en-US', options)
    .substring(0, 2); // user current time
  productSDK
    .getProductInventory({
      productCode: productCode,
      locationCodes: localStoreCode,
    })
    .then(res => {
      if (res.totalCount > 0) {
        if (res.items[0].stockAvailable > 0) {
          console.log('Item Found in the local store');
          // console.log(res);
          locationSDK
            .getLocation({
              locationCode: localStoreCode,
              includeAttributeDefinition: true,
            })
            .then(location => {
              let localClosingHours;
              // checking store closed day or not
              if (!location.regularHours[dayArr[currentDay]].isClosed) {
                // checking if store is closing before 1 hour
                console.log(location.regularHours);
                localClosingHours = location.regularHours[
                  dayArr[currentDay]
                ].closeTime.substring(0, 2); // subtracted 4 to convert to UTC
                if (localClosingHours - currentUserHours >= 1) {
                  const orderBefore = localClosingHours - 1;
                  const formattedToday = currentDate.toLocaleTimeString('en-US', {
                    timeZone: 'EST',
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                  }).split(', ');
                  context.response.body = {
                    message: `Available to pick up Today If ordered By ${orderBefore}:00`,
                    date: formattedToday,
                    allowPickup: true,
                    quantity: quantity
                  };
                } else {
                  const newDate = new Date(currentDate.setDate(currentDate.getDate() + 1)).toLocaleTimeString('en-US', {
                    timeZone: 'EST',
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                  }).split(', ');
                  context.response.body = {
                    message: 'Available for pickup tomorrow',
                    date: newDate,
                    allowPickup: true,
                    quantity: quantity
                  };
                }
              } else {
                const newDate = new Date(currentDate.setDate(currentDate.getDate() + 1)).toLocaleTimeString('en-US', {
                  timeZone: 'EST',
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                }).split(', ');
                context.response.body = {
                  message: 'Store closed today, available for pickup tomorrow',
                  date: newDate,
                  allowPickup: false,
                  quantity: quantity
                };
              }
              context.response.end();
              // context.response.end();
            })
            .catch(err => {
              console.log(err, 'Errors');
              context.response.body = err.originalError.message;
              context.response.end();
            });
        } else {
          locationSDK
            .getLocation({
              locationCode: localStoreCode,
              includeAttributeDefinition: true,
            })
            .then(location => {
              // If store has a hub else it is a hub itself
              if (location.attributes.length) {
                let transferDay1;
                let transferDay2;
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
                }
                productSDK
                  .getProductInventory({
                    productCode: productCode,
                    locationCodes: hubId[0],
                  })
                  .then(hubInventory => {
                    if (hubInventory.totalCount > 0) {
                      if (hubInventory.items[0].stockAvailable > 0) {
                        let formattedPickupDate;
                        let nearestNextTransferDay;
                        let pickupDate;
                        if (
                          currentDay === transferDay1 || currentDay === transferDay2) {
                          if (currentUserHours < 13) {
                            context.response.body = {
                              message:
                                'Available to pick up in 1 - 2 Business Days',
                              date: new Date(currentDate.setDate(currentDate.getDate() + 1)).toLocaleTimeString('en-US', {
                                timeZone: 'EST',
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric',
                              }).split(', ')
                            };
                          } else {
                            const nearestNextPickupDay = currentDay - transferDay1 > 0 ? transferDay2
                            - currentDay + 2 : transferDay1 - currentDay + 2;
                            console.log(
                              new Date(
                                currentDate.getFullYear() + currentDate.getMonth() + currentDate.getDate()
                                + nearestNextPickupDay
                              )
                            );

                            context.response.body = {
                              message:
                                `Avaiable for pickup in ${nearestNextPickupDay} days`,
                              date: new Date(new Date().setDate(new Date().getDate() + nearestNextPickupDay)),
                              allowPickup: true,
                              quantity: quantity
                            };
                          }
                        } else {
                          nearestNextTransferDay = currentDay - transferDay1 > 0
                            ? transferDay2 - currentDay + 2
                            : transferDay1 - currentDay + 2;
                          pickupDate = new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            currentDate.getDate() + nearestNextTransferDay
                          );
                          console.log(
                            currentDate.getDate(),
                            nearestNextTransferDay,
                            currentDate.getDate() + nearestNextTransferDay
                          );
                          formattedPickupDate = pickupDate.toLocaleTimeString('en-US', {
                            timeZone: 'EST',
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                          }).split(', ');
                          console.log(formattedPickupDate[0].split('/'));
                          const formattedMonth = formattedPickupDate[0].split('/')[0];
                          const formattedDate = formattedPickupDate[0].split('/')[1];
                          context.response.body = {
                            message:
                              `Avaiable for pickup on ${formattedMonth}/${formattedDate}`,
                            date: formattedPickupDate,
                            allowPickup: true,
                            quantity: quantity
                          };
                        }
                        context.response.end();
                      } else {
                        context.response.body = {
                          message: 'Item available for pickup in 2-4 weeks',
                          allowPickup: false,
                          quantity: quantity
                        };
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
                context.response.body = {
                  message: 'Item available for pickup in 2-4 weeks',
                  allowPickup: false,
                  quantity: quantity
                };
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
        context.response.body = {
          message: 'Item available for pickup in 2-4 weeks',
          allowPickup: false,
          quantity: quantity
        };
        context.response.end();
      }
    })
    .catch(err => {
      console.log(err, 'Errors');
      context.response.body = err.originalError.message;
      context.response.end();
    });
};
