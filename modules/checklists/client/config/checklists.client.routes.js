'use strict';

// Setting up route
angular.module('checklists').config(['$stateProvider',
  function ($stateProvider) {
    // checklists state routing
    $stateProvider
      .state('checklists', {
        abstract: true,
        url: '/checklists',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      })
      .state('checklists.list', {
        url: '',
        templateUrl: 'modules/checklists/views/list-checklists.client.view.html'
      })
      .state('checklists.create', {
        url: '/create',
        templateUrl: 'modules/checklists/views/create-checklist.client.view.html'
      })
      .state('checklists.view', {
        url: '/:checklistId',
        templateUrl: 'modules/checklists/views/view-checklist.client.view.html'
      })
      .state('checklists.edit', {
        url: '/:checklistId/edit',
        templateUrl: 'modules/checklists/views/edit-checklist.client.view.html'
      });
  }
]);
