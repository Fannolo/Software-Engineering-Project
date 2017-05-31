'use strict';

// Setting up route
angular.module('drones').config(['$stateProvider',
  function ($stateProvider) {
    // drones state routing
    $stateProvider
      .state('drones', {
        abstract: true,
        url: '/drones',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      })
      .state('drones.list', {
        url: '',
        templateUrl: 'modules/drones/views/list-drones.client.view.html'
      })
      .state('drones.create', {
        url: '/create',
        templateUrl: 'modules/drones/views/create-drone.client.view.html'
      })
      .state('drones.view', {
        url: '/:droneId',
        templateUrl: 'modules/drones/views/view-drone.client.view.html'
      })
      .state('drones.edit', {
        url: '/:droneId/edit',
        templateUrl: 'modules/drones/views/edit-drone.client.view.html'
      });
  }
]);
