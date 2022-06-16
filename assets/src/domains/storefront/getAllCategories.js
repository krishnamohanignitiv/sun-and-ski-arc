const CategorySDK = require('mozu-node-sdk/clients/commerce/catalog/admin/category');

module.exports = (context, callback) => {
  const categorySDK = new CategorySDK(context);
  categorySDK.context['user-claims'] = null;

  const getAllCategories = () => categorySDK.getCategories({ pageSize: 200 });

  const main = () => {
    const responseBody = [];
    getAllCategories().then(res => {
      res.items.forEach(item => {
        const data = {};
        data.id = item.id;
        data.content = item.content;
        responseBody.push(data);
      });
      context.response.body = responseBody;
      callback();
    });
  };

  main();
};
