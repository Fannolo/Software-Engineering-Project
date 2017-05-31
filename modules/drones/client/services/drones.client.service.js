'use strict';

//drones service used for communicating with the drones REST endpoints
angular.module('drones').factory('Drones', ['$resource',
  function ($resource) {
    return $resource('api/drones/:droneId', {
      droneId: '@_id'
    }, {
      get: { method:'GET', cache: false },
      query: { method:'GET', cache: false, isArray:true },
      update: {
        method: 'PUT'
      }
    });
  }
]);
