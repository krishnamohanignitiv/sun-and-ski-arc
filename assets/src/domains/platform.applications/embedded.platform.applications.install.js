/* eslint-disable import/no-extraneous-dependencies */
/*
 * This custom function was generated by the Actions Generator
 * in order to enable the other custom functions in this app
 * upon installation into a tenant.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line node/no-unpublished-require
const ActionInstaller = require('mozu-action-helpers/installers/actions');

module.exports = function (context, callback) {
  const installer = new ActionInstaller({ context: context.apiContext });
  installer.enableActions(context).then(callback.bind(null, null), callback);
};
