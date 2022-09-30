/* eslint-disable no-unused-vars */
const superagent = require('superagent');
const Client = require('mozu-node-sdk/clients/platform/application');
const B2BAccountSDK = require('mozu-node-sdk/clients/commerce/customer/b2BAccount');
const EntityClient = require('mozu-node-sdk/clients/platform/entitylists/entity');
const PriceListController = require('../../pricelist/PriceListController');
const EntityListController = require('../../EntityList/EntityListController');
const YotpoController = require('../../Yotpo/YotpoController');

const priceList = new PriceListController();
const entityList = new EntityListController();
const yotpoOrder = new YotpoController();

module.exports = (context, callback) => {
  // console.log('orders after invoked');
  // callback();
  // instantiating B2b2AccountSDK
  const b2bAccountSdk = new B2BAccountSDK(context);
  b2bAccountSdk.context['user-claims'] = null;
  const entitySDK = new EntityClient(context);
  entitySDK.context['user-claims'] = null;

  async function klaviyoServerSide(klaviyoPayload) {
    return superagent
      .post(
        'https://a.klaviyo.com/api/track'
      )
      .set('Content-Type', 'application/json')
      .send(klaviyoPayload);
  }
  function getP21Id(order) {
    let customerAccountId;
    for (let i = 0; i < Object.keys(order).length; i++) {
      if (Object.keys(order)[i] === 'customerAccountId') {
        customerAccountId = order.customerAccountId;
      }
    }
    return customerAccountId;
  }
  // function for addition of P21 Customer Attribute (preferred location)
  // at line item level
  function addP21CustomerAttributeToItem(order) {
    console.log('p21Attribute addition invoked');
    try {
      console.log('p21Attribute addition invoked in try');
      const customerAccountId = getP21Id(order);
      b2bAccountSdk.getB2BAccountAttributes({
        accountId: customerAccountId,
      }).then(res => {
        // console.log(res);
        if (res.totalCount > 0) {
          const p21AttributeArray = res.items.filter(item => item.fullyQualifiedName === 'tenant~account_id');
          const assignedStoreArray = res.items.filter(item => item.fullyQualifiedName === 'tenant~assigned_store');
          console.log('p21AttributeArray', p21AttributeArray);
          console.log('assignedStore Array found', assignedStoreArray);
          if (p21AttributeArray.length > 0) {
            console.log('p21 Id attribute found');
            const p21Attribute = p21AttributeArray[0];
            if (p21Attribute.values.length > 0) {
              const assignedStore = assignedStoreArray.length > 0 ? assignedStoreArray[0] : false;
              if (assignedStore && assignedStore.values.length > 0) {
                console.log('p21Id and assignedStore found; adding p21 isP21Customer as ', assignedStore.values[0]);
                order.items.forEach(item => {
                  context.exec.setItemData('assignedStore', assignedStore.values[0], item.id);
                });
              } else {
                console.log('p21Id found and assignedStore not found; adding p21 isP21Customer as 0');
                order.items.forEach(item => {
                  context.exec.setItemData('assignedStore', 0, item.id);
                  console.log(item.id, ' attribute\'s set');
                });
              }
            } else {
              console.log('p21Id not found; adding p21 isP21Customer as 0');
              order.items.forEach(item => {
                context.exec.setItemData('assignedStore', 0, item.id);
              });
            }
          } else {
            console.log('p21 attribute not found; adding p21 isP21Customer as 0');
            order.items.forEach(item => {
              context.exec.setItemData('assignedStore', 0, item.id);
            });
          }
        } else {
          console.log('no attributes found; adding p21 isP21Customer as 0');
          order.items.forEach(item => {
            context.exec.setItemData('assignedStore', 0, item.id);
          });
        }
      });
    } catch (e) {
      console.log('error in code');
      console.log(e);
      callback();
    }
  }
  // function to add order attributes
  function addOrderAttributes(order, quoteExtendedProperty, entityListFullName) {
    try {
      if (!quoteExtendedProperty) {
        console.log('no quoteId found');
        const customerAccountId = getP21Id(order);
        const shipToId = [];
        const termsId = [];
        b2bAccountSdk.getB2BAccountAttributes({
          accountId: customerAccountId,
        }).then(res => {
          if (res.totalCount > 0) {
            res.items.forEach(item => {
              console.log('b2battribute', item);
              if (item.fullyQualifiedName === 'tenant~ship_to_id') {
                shipToId.push(item.values[0]);
              }
              if (item.fullyQualifiedName === 'tenant~terms_id') {
                termsId.push(item.values[0]);
              }
            });
          }
          if (shipToId.length === 0) {
            shipToId.push('122685');
          }
          if (termsId.length === 0) {
            termsId.push('1');
          }
          console.log('shipToId and termsId', shipToId, termsId);
          context.exec.setAttribute('tenant~ship_to_id', shipToId);
          context.exec.setAttribute('tenant~terms_id', termsId);
          console.log('Attributes set');
        });
      } else {
        console.log('quoteId found');
        entitySDK.getEntity({
          entityListFullName: entityListFullName,
          id: quoteExtendedProperty
        }).then(res => {
          try {
            context.exec.setAttribute('tenant~ship_to_id', res.ship_to_id);
            context.exec.setAttribute('tenant~terms_id', res.terms_id);
          } catch (e) {
            console.log('Entity List error', e);
            callback();
          }
        });
      }
    } catch (e) {
      console.log(e);
      callback();
    }
  }
  try {
    const FQNName = context.configuration.entityListFQNName;
    const order = context.get.order();
    // quote Id extended property
    const quoteExtendedProperty = order.extendedProperties.find(data => data.key === 'quoteId');
    // Klayvio Item List
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
      // console.log('Context Configuration', context.configuration.entityListFQNName);
    if (order.status === 'Accepted') {
      // code for p21 attribute addition at line level
      addP21CustomerAttributeToItem(order);
      // code for order attribute addition
      addOrderAttributes(order, quoteExtendedProperty, FQNName);
      // console.log(quoteExtendedProperty);
      // console.log(order.billingInfo.billingContact);
      // const utcTime = order.auditInfo.createDate;
      // const utcToUnixTime = new Date(utcTime).valueOf();
      // console.log(order.orderNumber);
      // Klaviyo Code
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
          entityListFQN: FQNName,
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
            // console.log(err);
            callback();
          });
      }
    } else {
      console.log('Unwanted Console');
      callback();
    }
  } catch (e) {
    console.log(e);
    callback();
  }
};
