/**
 * Implementation for embedded.commerce.orders.action.after

 * This custom function will receive the following context object:
{
  "exec": {
    "setItemAllocation": {
      "parameters": [
        {
          "name": "allocationId",
          "type": "number"
        },
        {
          "name": "expiration",
          "type": "date"
        },
        {
          "name": "productCode",
          "type": "string"
        },
        {
          "name": "itemId",
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.orderItem"
      }
    },
    "setAttribute": {
      "parameters": [
        {
          "name": "fqn",
          "type": "string"
        },
        {
          "name": "values",
          "type": "object"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.order"
      }
    },
    "removeAttribute": {
      "parameters": [
        {
          "name": "fqn",
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.order"
      }
    },
    "setData": {
      "parameters": [
        {
          "name": "key",
          "type": "string"
        },
        {
          "name": "value",
          "type": "object"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.order"
      }
    },
    "removeData": {
      "parameters": [
        {
          "name": "key",
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.order"
      }
    },
    "setItemData": {
      "parameters": [
        {
          "name": "key",
          "type": "string"
        },
        {
          "name": "value",
          "type": "object"
        },
        {
          "name": "itemId",
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.orderItem"
      }
    },
    "removeItemData": {
      "parameters": [
        {
          "name": "key",
          "type": "string"
        },
        {
          "name": "itemId",
          "type": "string"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.orderItem"
      }
    },
    "setDutyAmount": {
      "parameters": [
        {
          "name": "dutyAmount",
          "type": "number"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.order.order"
      }
    }
  },
  "get": {
    "order": {
      "parameters": [],
      "return": {
        "type": "mozu.commerceRuntime.contracts.orders.order"
      }
    }
  }
}

 */
const Client = require('mozu-node-sdk/clients/platform/application');
// const PriceListController = require('../../pricelist/PriceListController');
const EntityListController = require('../../EntityList/EntityListController');

// const priceList = new PriceListController();
const entityList = new EntityListController();

module.exports = function (context, callback) {
  /**
   * Set priceList to default
   */
  const order = context.get.order();
  if (order.status === 'Accepted') {
    const quoteExtendedProperty = order.extendedProperties.find(data => data.key === 'quoteId');

    console.log(quoteExtendedProperty);

    if (!quoteExtendedProperty) {
      console.log('No quote extendedProperty');
      callback();
    }

    const productToUpdate = order.items.map(product => ({
      productCode: product.product.productCode,
      orderQty: product.quantity
    }));

    const payload = {
      entityListFQN: 'quotelist@coastal',
      quoteId: quoteExtendedProperty.value,
      productToUpdate
    };

    const clientContext = new Client();

    // const promises = [entityList.updateEntity(clientContext, payload), priceList.updateB2BAccount(context, {}) ];

    entityList
      .updateEntity(clientContext, payload)
    // eslint-disable-next-line no-unused-vars
      .then(res => {
      // console.log(res);
        callback();
      });

    // priceList
    // .updateB2BAccount(clientContext,{

  // })
  } else {
    callback();
  }
};
