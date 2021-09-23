/* eslint-disable max-len */
const EntityClient = require('mozu-node-sdk/clients/platform/entitylists/entity');

class EntityListServices {
  async getEntity(context, payload) {
    const entityClient = new EntityClient(context);
    entityClient.context['user-claims'] = null;
    return entityClient.getEntity({
      entityListFullName: payload.entityListFQN,
      id: payload.quoteId
    });
  }

  async updateEntity(context, payload) {
    try {
      const entityData = await this.getEntity(context, payload);
      console.log(entityData);
      const entityClient = new EntityClient(context);
      entityClient.context['user-claims'] = null;

      // eslint-disable-next-line max-len
      const tempArr = [];
      entityData.productList.forEach(product => {
        payload.productToUpdate.forEach(orderedProduct => {
          console.log(orderedProduct, product);
          if (orderedProduct.productCode === product.productCode) {
            tempArr.push({
              productCode: orderedProduct.productCode,
              availableQty: Number(product.availableQty) - Number(orderedProduct.orderQty)
            });
          } else {
            tempArr.push(product);
          }
        });
      });
      entityData.productList = [].concat(tempArr);
      return entityClient.updateEntity({
        entityListFullName: payload.entityListFQN,
        id: payload.quoteId
      }, {
        body: entityData
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }
}

module.exports = EntityListServices;
