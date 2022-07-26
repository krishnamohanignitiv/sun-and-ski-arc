/* eslint-disable no-unused-vars */
const superagent = require('superagent');
const Client = require('mozu-node-sdk/clients/platform/application');
const PriceListController = require('../../pricelist/PriceListController');
const EntityListController = require('../../EntityList/EntityListController');
const YotpoController = require('../../Yotpo/YotpoController');

const priceList = new PriceListController();
const entityList = new EntityListController();
const yotpoOrder = new YotpoController();

module.exports = function (context, callback) {
  const order = context.get.order();
  async function klaviyoServerSide(klaviyoPayload) {
    return superagent
      .post(
        'https://a.klaviyo.com/api/track'
      )
      .set('Content-Type', 'application/json')
      .send(klaviyoPayload);
  }
  if (order.status === 'Accepted') {
    const quoteExtendedProperty = order.extendedProperties.find(data => data.key === 'quoteId');

    console.log(quoteExtendedProperty);
    console.log(order.billingInfo.billingContact);
    // Klaviyo Code
    const klaviyoItemList = order.items.map(item => ({
      ProductID: item.product.productCode,
      SKU: item.product.productCode,
      ProductName: item.product.name,
      Quantity: item.quantity,
      ItemPrice: item.product.price.price,
      RowTotal: item.total,
      ProductURL: '',
      ImageURL: item.product.imageUrl,
      Categories: ['Safety'],
      Brand: 'Safety'
    }));
    // const utcTime = order.auditInfo.createDate;
    // const utcToUnixTime = new Date(utcTime).valueOf();
    console.log(order.orderNumber);

    const klaviyoPayload = {
      token: 'VwzhXM',
      event: 'Placed Order',
      customer_properties: {
        $email: order.fulfillmentInfo.fulfillmentContact.email,
        $first_name: order.fulfillmentInfo.fulfillmentContact.firstName,
        $last_name: order.fulfillmentInfo.fulfillmentContact.lastNameOrSurname,
        $phone_number: order.fulfillmentInfo.fulfillmentContact.phoneNumbers.home,
        $address1: order.fulfillmentInfo.fulfillmentContact.address.address1,
        $address2: order.fulfillmentInfo.fulfillmentContact.address.address2,
        $city: order.fulfillmentInfo.fulfillmentContact.address.cityOrTown,
        $zip: order.fulfillmentInfo.fulfillmentContact.address.postalOrZipCode,
        $region: order.fulfillmentInfo.fulfillmentContact.address.stateOrProvince,
        $country: order.fulfillmentInfo.fulfillmentContact.address.countryCode
      },
      properties: {
        $event_id: order.orderNumber,
        $value: order.total,
        OrderId: order.orderNumber,
        // Categories: ['Fiction'],
        // ItemNames: '3M RUGGED COMFORT QUICK LATCH e',
        // Brands: ['Kids Books', 'Harcourt Classics'],
        // DiscountCode: 'Free Shipping',
        // DiscountValue: 5,
        Items: klaviyoItemList,
        BillingAddress: {
          FirstName: order.billingInfo.billingContact.firstName,
          LastName: order.billingInfo.billingContact.lastNameOrSurname,
          Company: order.billingInfo.billingContact.companyOrOrganization,
          Address1: order.billingInfo.billingContact.address.address1,
          Address2: order.billingInfo.billingContact.address.address2,
          City: order.billingInfo.billingContact.address.cityOrTown,
          // Region: 'Rhode Island',
          RegionCode: order.billingInfo.billingContact.address.stateOrProvince,
          Country: 'United States',
          CountryCode: order.billingInfo.billingContact.address.countryCode,
          Zip: order.billingInfo.billingContact.address.postalOrZipCode,
          Phone: order.billingInfo.billingContact.phoneNumbers.home
        },
        ShippingAddress: {
          FirstName: order.fulfillmentInfo.fulfillmentContact.firstName,
          LastName: order.fulfillmentInfo.fulfillmentContact.lastNameOrSurname,
          Company: '',
          Address1: order.fulfillmentInfo.fulfillmentContact.address.address1,
          Address2: order.fulfillmentInfo.fulfillmentContact.address.address2,
          City: order.fulfillmentInfo.fulfillmentContact.address.cityOrTown,
          // Region: 'Rhode Island',
          RegionCode: order.fulfillmentInfo.fulfillmentContact.address.stateOrProvince,
          Country: 'United States',
          CountryCode: order.fulfillmentInfo.fulfillmentContact.address.countryCode,
          Zip: order.fulfillmentInfo.fulfillmentContact.address.postalOrZipCode,
          Phone: order.fulfillmentInfo.fulfillmentContact.phoneNumbers.home
        }
      },
      // time: utcToUnixTime
    };

    // /**
    //  * Yotpo
    //  */
    // const yotpoLineItems = order.items.map(product => ({
    //   quantity: product.quantity,
    //   external_product_id: product.product.productCode
    // }));

    // // eslint-disable-next-line no-unused-vars
    // const yotpoPayload = {
    //   order: {
    //     external_id: order.orderNumber,
    //     order_date: order.acceptedDate,
    //     currencyCode: order.currencyCode,
    //     customer: {
    //       external_id: order.billingInfo.billingContact.id,
    //       email: order.billingInfo.billingContact.email,
    //       first_name: order.billingInfo.billingContact.firstName,
    //       last_name: order.billingInfo.billingContact.lastNameOrSurname,
    //       accepts_sms_marketing: false,
    //       accepts_email_marketing: false
    //     },
    //     line_items: yotpoLineItems,
    //     fulfillments: [{
    //       fulfillment_date: order.acceptedDate,
    //       external_id: order.orderNumber,
    //       status: 'pending',
    //       fulfilled_items: yotpoLineItems
    //     }]
    //   }
    // };

    // console.log(yotpoPayload.fulfillments);
    // console.log(yotpoLineItems);
    // // Yotpo End

    if (!quoteExtendedProperty) {
      console.log('No quote extendedProperty');
      // callback();
      klaviyoServerSide(klaviyoPayload)
        .then(res => {
          console.log('Placed OrderData:::::::');
          //  console.log('Placed OrderData:::::::', res);
          callback();
        })
        .catch(err => {
          console.log('err');
          callback();
        });
      // yotpoOrder.createOrder(yotpoPayload)
      //   .then(res => {
      //     console.log(res);
      //     console.log('Order Created');
      //     callback();
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     callback();
      //   });
    } else {
      const productToUpdate = order.items.map(product => ({
        productCode: product.product.productCode,
        availableQty: product.quantity
      }));

      const payload = {
        entityListFQN: 'quotelist@coscon',
        quoteId: quoteExtendedProperty.value,
        productToUpdate
      };

      const clientContext = new Client();

      const promises = [entityList.updateEntity(clientContext, payload), priceList.updateB2BAccount(context, {
        accountId: order.customerAccountId,
        priceListCode: 'default'
      })];

      promises.push(klaviyoServerSide(klaviyoPayload));

      Promise.all(promises)
        // .then(() => yotpoOrder.createOrder(yotpoPayload))
      // eslint-disable-next-line no-unused-vars
        .then(res => {
          console.log('Done');
          callback();
        })
        .catch(err => {
          console.log(err);
          callback();
        });
    }
  } else {
    console.log('Unwanted Console');
    callback();
  }
};
