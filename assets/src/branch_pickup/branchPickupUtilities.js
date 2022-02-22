/* eslint-disable max-len */
const moment = require('moment-timezone');

// we will be using 'America/New_York' as EST and 'America/Chicago' as CST timezone
// moment is for time calculations and momenttz is for timezone
const timeZone = 'America/New_York';

function calculateTransferDate(transferDay1, transferDay2, currentDay, transferTime) {
  let nearestNextPickupDay;
  console.log(moment(new Date()).tz(timeZone).hour());
  if (
    currentDay === transferDay1 || currentDay === transferDay2) {
    console.log('today is transfer day');
    if (moment(new Date()).tz(timeZone).valueOf() < transferTime) {
      nearestNextPickupDay = 1;
    } else {
      if (currentDay === transferDay1) {
        nearestNextPickupDay = transferDay2 - currentDay + 1;
      }
      if (currentDay === transferDay2) {
        nearestNextPickupDay = transferDay1 - currentDay + 8;
      }
    }
  } else {
    console.log('today is not transfer day');
    if (currentDay < transferDay1) {
      nearestNextPickupDay = transferDay1 - currentDay + 1;
      console.log(nearestNextPickupDay);
    } else if (currentDay < transferDay2) {
      nearestNextPickupDay = transferDay2 - currentDay + 1;
    } else {
      nearestNextPickupDay = transferDay1 - currentDay + 8;
    }
  }
  return new Date(new Date().setDate(new Date().getDate() + nearestNextPickupDay)).toLocaleString('en-US');
}

function calculatePickupDate(closingTime) {
  const current = new Date();
  console.log(current);
  if (closingTime - moment(new Date()).tz(timeZone).valueOf() >= 3600000) return current.toLocaleString('en-US');
  return new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleString('en-US');
}
module.exports = { calculateTransferDate: calculateTransferDate, calculatePickupDate: calculatePickupDate };
