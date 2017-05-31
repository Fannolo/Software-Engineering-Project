'use strict';

/**
 * Module dependencies.
 */
var dronesPolicy = require('../policies/drones.server.policy'),
  drones = require('../controllers/drones.server.controller');

module.exports = function (app) {
  // drones collection routes
  app.route('/api/drones').all(dronesPolicy.isAllowed)
    .get(drones.list)
    .post(drones.create);

  // Single drone routes
  app.route('/api/drones/:droneId').all(dronesPolicy.isAllowed)
    .get(drones.read)
    .put(drones.update)
    .delete(drones.delete);

  // Finish by binding the drone middleware
  app.param('droneId', drones.droneByID);
};
