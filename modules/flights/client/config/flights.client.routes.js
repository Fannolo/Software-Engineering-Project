'use strict';

// Setting up route
angular.module('flights').config(['$stateProvider',
  function ($stateProvider) {
    // flights state routing
    $stateProvider
      .state('flights', {
        abstract: true,
        url: '/flights',
        template: '<ui-view/>',
        data: {
          roles: ['admin','user']
        }
      })
      .state('flights.list', {
        url: '',
        templateUrl: 'modules/flights/views/list-flights.client.view.html'
      })
      .state('flights.create', {
        url: '/create',
        templateUrl: 'modules/flights/views/create-flight.client.view.html'
      })
      .state('flights.active',{
        url:'/active',
        templateUrl: 'modules/flights/views/active-list-flight.client.view.html'
      })
      .state('flights.view', {
        url: '/:flightId',
        templateUrl: 'modules/flights/views/view-flight.client.view.html'
      })
      .state('flights.edit', {
        url: '/:flightId/edit',
        templateUrl: 'modules/flights/views/edit-flight.client.view.html'
      });
  }
]);
