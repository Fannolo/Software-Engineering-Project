'use strict';

// Configuring the Articles module
angular.module('drones').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      roles: ['admin'],
      title: 'Drones',
      state: 'drones',
      type: 'dropdown',

    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'drones', {
      title: 'List Drones',
      state: 'drones.list'
    });
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'drones', {
      title: 'Create Drones',
      state: 'drones.create'
    });
  }
]);
