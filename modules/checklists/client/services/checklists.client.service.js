'use strict';

//checklists service used for communicating with the checklists REST endpoints
angular.module('checklists').factory('Checklists', ['$resource',
  function ($resource) {
    return $resource('api/checklists/:checklistId', {
      checklistId: '@_id'
    }, {
      get: { method:'GET', cache: false },
      query: { method:'GET', cache: false, isArray:true },
      update: {
        method: 'PUT'
      }
    });
  }
]);
