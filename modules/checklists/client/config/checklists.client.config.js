'use strict';

// Configuring the checklists module
angular.module('checklists').run(['Menus',
  function (Menus) {
    // Add the checklists dropdown item
    Menus.addMenuItem('topbar', {
      roles: ['admin'],
      title: 'Checklists',
      state: 'checklists',
      type: 'dropdown',

    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'checklists', {
      title: 'List checklists',
      state: 'checklists.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'checklists', {
      title: 'Create checklists',
      state: 'checklists.create'
    });
  }
]);
