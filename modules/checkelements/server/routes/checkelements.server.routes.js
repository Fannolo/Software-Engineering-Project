'use strict';

/**
 * Module dependencies.
 */
var checkelementsPolicy = require('../policies/checkelements.server.policy'),
  checkelements = require('../controllers/checkelements.server.controller');

module.exports = function (app) {
  // checkelements collection routes
  app.route('/api/checkelements').all(checkelementsPolicy.isAllowed)
    .get(checkelements.list)
    .post(checkelements.create);

  // Single checkelement routes
  app.route('/api/checkelements/:checkelementId').all(checkelementsPolicy.isAllowed)
    .get(checkelements.read)
    .put(checkelements.update)
    .delete(checkelements.delete);

  // Finish by binding the checkelement middleware
  app.param('checkelementId', checkelements.checkelementByID);
};
