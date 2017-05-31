'use strict';

// Configuring the flights module
angular.module('flights').run(['Menus',
  function (Menus) {
    // Add the flights dropdown item
    Menus.addMenuItem('topbar', {
      roles: ['user','admin'],
      title: 'Flights',
      state: 'flights',
      type: 'dropdown',

    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'flights', {
      roles: ['admin','user'],
      title: 'List Flights',
      state: 'flights.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'flights', {
      roles: ['user'],
      title: 'Create Flights',
      state: 'flights.create'
    });
  }
]);
