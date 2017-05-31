'use strict';

//checkelements service used for communicating with the checkelements REST endpoints
angular.module('checkelements').factory('Checkelements', ['$resource',
  function ($resource) {
    return $resource('api/checkelements/:checkelementId', {
      checkelementId: '@_id'
    }, {
      update: {
        get: { method:'GET', cache: false },
        query: { method:'GET', cache: false, isArray:true },
        method: 'PUT'
      }
    });
  }
]);
