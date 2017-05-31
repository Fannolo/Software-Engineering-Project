'use strict';

/**
 * Module dependencies.
 */
var flightsPolicy = require('../policies/flights.server.policy'),
  flights = require('../controllers/flights.server.controller');

module.exports = function (app) {
  // flights collection routes
  app.route('/api/flights').all(flightsPolicy.isAllowed)
    .get(flights.list)
    .post(flights.create);

  // Single flight routes
  app.route('/api/flights/:flightId').all(flightsPolicy.isAllowed)
    .get(flights.read)
    .put(flights.update)
    .delete(flights.delete);

  // Finish by binding the flight middleware
  app.param('flightId', flights.flightByID);
};
