'use strict';

// Setting up route
angular.module('checkelements').config(['$stateProvider',
  function ($stateProvider) {
    // checkelements state routing
    $stateProvider
      .state('checkelements', {
        abstract: true,
        url: '/checkelements',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      })
      .state('checkelements.list', {
        url: '',
        templateUrl: 'modules/checkelements/views/list-checkelements.client.view.html'
      })
      .state('checkelements.create', {
        url: '/create',
        templateUrl: 'modules/checkelements/views/create-checkelement.client.view.html'
      })
      .state('checkelements.view', {
        url: '/:checkelementId',
        templateUrl: 'modules/checkelements/views/view-checkelement.client.view.html'
      })
      .state('checkelements.edit', {
        url: '/:checkelementId/edit',
        templateUrl: 'modules/checkelements/views/edit-checkelement.client.view.html'
      });
  }
]);
