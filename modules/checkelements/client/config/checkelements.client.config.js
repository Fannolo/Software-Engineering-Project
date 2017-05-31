'use strict';

// Configuring the checkelements module
angular.module('checkelements').run(['Menus',
  function (Menus) {
    // Add the checkelements dropdown item
    Menus.addMenuItem('topbar', {
      roles: ['admin'],
      title: 'Checkelements',
      state: 'checkelements',
      type: 'dropdown',

    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'checkelements', {
      title: 'List Checkelements',
      state: 'checkelements.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'checkelements', {
      title: 'Create Checkelements',
      state: 'checkelements.create'
    });
  }
]);
