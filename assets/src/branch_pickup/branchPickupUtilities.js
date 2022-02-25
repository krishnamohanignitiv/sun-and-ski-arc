/* eslint-disable max-len */
const moment = require('moment-timezone');

// we will be using 'America/New_York' as EST and 'America/Chicago' as CST timezone
// moment is for time calculations and momenttz is for timezone
const timeZone = 'America/New_York';

// day mapping
const dayArr = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

function calculateTransferDate(transferDay1, transferDay2, currentDay, transferTime) {
  let nearestNextPickupDay;
  const current = moment(new Date()).tz(timeZone).valueOf();
  console.log('transferTime', transferTime);
  if (
    currentDay === transferDay1 || currentDay === transferDay2) {
    console.log('today is transfer day');
    if (current < transferTime) {
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
  return current + (3600 * 1000 * 24 * nearestNextPickupDay);
}

function calculatePickupDate(closingTime) {
  const current = moment(new Date()).tz(timeZone).valueOf();
  if (closingTime - current >= 3600000) return current;
  return current + (3600 * 1000 * 24 * 1);
}

function calculateClosingTime(closingHour, closingMin) {
  const date = new Date(new Date().toLocaleString('en-US', { hour12: false }));
  date.setHours(closingHour);
  date.setMinutes(closingMin);
  date.setSeconds(0);
  return date.getTime();
}
function extractAttributes(attributes) {
  const returnObj = {};
  for (let i = 0; i < attributes.length; i++) {
    if (attributes[i].attributeDefinition.attributeCode === 'transfer-day-2') {
      returnObj.transferDay2 = dayArr.indexOf(
        attributes[i].values[0].toLowerCase()
      );
    }
    if (attributes[i].attributeDefinition.attributeCode === 'transfer-day-1') {
      returnObj.transferDay1 = dayArr.indexOf(
        attributes[i].values[0].toLowerCase()
      );
    }
    if (attributes[i].attributeDefinition.attributeCode === 'hub-id') {
      returnObj.hubId = attributes[i].values;
    }
    if (attributes[i].attributeDefinition.attributeCode === 'transfer-time') {
      const transferTime = attributes[i].values[0].toString();
      const transferHours = transferTime.length === 3 ? transferTime.substring(0, 1) : transferTime.substring(0, 2);
      returnObj.transferHours = parseInt(transferHours, 10);
      returnObj.transferMins = parseInt(transferTime.substring(2), 10);
    }
  }
  return returnObj;
}
module.exports = {
  calculateTransferDate: calculateTransferDate,
  calculatePickupDate: calculatePickupDate,
  calculateClosingTime: calculateClosingTime,
  extractAttributes: extractAttributes
};
