module.exports = (context, callback) => {
  console.log('Arc running');
  context.response.body = 'responding';
  callback();
};
