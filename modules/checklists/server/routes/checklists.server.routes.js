'use strict';

/**
 * Module dependencies.
 */
var checklistsPolicy = require('../policies/checklists.server.policy'),
  checklists = require('../controllers/checklists.server.controller');

module.exports = function (app) {
  // Checklists collection routes
  app.route('/api/checklists').all(checklistsPolicy.isAllowed)
    .get(checklists.list)
    .post(checklists.create);

  // Single checklist routes
  app.route('/api/checklists/:checklistId').all(checklistsPolicy.isAllowed)
    .get(checklists.read)
    .put(checklists.update)
    .delete(checklists.delete);

  // Finish by binding the checklist middleware
  app.param('checklistId', checklists.checklistByID);
};
