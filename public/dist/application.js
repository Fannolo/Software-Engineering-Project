'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
  function ($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {
  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        $state.go('authentication.signin', {}, {
          notify: false
        }).then(function () {
          $rootScope.$broadcast('$stateChangeSuccess', 'authentication.signin', {}, toState, toParams);
        });
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    $state.previous = {
      state: fromState,
      params: fromParams,
      href: $state.href(fromState, fromParams)
    };
  });
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_') {
    window.location.hash = '#!';
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('checkelements');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('checklists');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('drones');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('flights');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

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

'use strict';

// checkelements controller
angular.module('checkelements').controller('CheckelementsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Checkelements',
  function ($scope, $stateParams, $location, Authentication, Checkelements) {
    $scope.authentication = Authentication;

    // Create new Checkelement
    $scope.create = function () {
      // Create new Checkelement object
      var checkelement = new Checkelements({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      checkelement.$save(function (response) {
        $location.path('checkelements/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing checkelement
    $scope.remove = function (checkelement) {
      if (checkelement) {
        checkelement.$remove();

        for (var i in $scope.checkelements) {
          if ($scope.checkelements[i] === checkelement) {
            $scope.checkelements.splice(i, 1);
          }
        }
      } else {
        $scope.checkelement.$remove(function () {
          $location.path('checkelements');
        });
      }
    };

    // Update existing checkelement
    $scope.update = function () {
      var checkelement = $scope.checkelement;

      checkelement.$update(function () {
        $location.path('checkelements/' + checkelement._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of checkelements
    $scope.find = function () {
      $scope.checkelements = Checkelements.query();
    };

    // Find existing Checkelement
    $scope.findOne = function () {
      $scope.checkelement = Checkelements.get({
        checkelementId: $stateParams.checkelementId
      });
    };
  }
]);

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

'use strict';

// checklists controller
angular.module('checklists').controller('ChecklistsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Checklists','$http',
  function ($scope, $stateParams, $location, Authentication, Checklists,$http) {
    $scope.authentication = Authentication;

    $scope.checkelements = [];
    $scope.getCheckelement = function (){
      $http({
        method: 'GET',
        url: '/api/checkelements'
      })
      .success(function(data,status){
        $scope.checkelements = data;
      })
      .error(function(data,status){
        return 'theres an error in the checkelements';
      });
    };

    $scope.selectedCheckelements = [];

    $scope.toggleSelection = function toggleSelection(checkelement) {
      $scope.selectedCheckelements.push(checkelement);
      console.log('sto pushando zi');
    };

    // Create new checklist
    $scope.create = function () {
      // Create new checklist object
      var checklist = new Checklists({
        title: this.title,
        content: this.content,
        checkelement: this.checkelement
      });

      // Redirect after save
      checklist.$save(function (response) {
        $location.path('checklists/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        $scope.checkelement = [];
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing checklist
    $scope.remove = function (checklist) {
      if (checklist) {
        checklist.$remove();

        for (var i in $scope.checklists) {
          if ($scope.checklists[i] === checklist) {
            $scope.checklists.splice(i, 1);
          }
        }
      } else {
        $scope.checklist.$remove(function () {
          $location.path('checklists');
        });
      }
    };

    // Update existing checklist
    $scope.update = function () {
      var checklist = $scope.checklist;

      checklist.$update(function () {
        $location.path('checklists/' + checklist._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of checklists
    $scope.find = function () {
      $scope.checklists = Checklists.query();
    };

    // Find existing checklist
    $scope.findOne = function () {
      $scope.checklist = Checklists.get({
        checklistId: $stateParams.checklistId
      });
    };
  }
]);

'use strict';

//checklists service used for communicating with the checklists REST endpoints
angular.module('checklists').factory('Checklists', ['$resource',
  function ($resource) {
    return $resource('api/checklists/:checklistId', {
      checklistId: '@_id'
    }, {
      get: { method:'GET', cache: false },
      query: { method:'GET', cache: false, isArray:true },
      update: {
        method: 'PUT'
      }
    });
  }
]);

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise('not-found');

    // Home state routing
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'modules/core/views/home.client.view.html'
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: 'modules/core/views/404.client.view.html'
      });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? true : options.isPublic),
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].isPublic : options.isPublic),
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].roles : options.roles),
        // roles: options.roles || 'admin',
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.link, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : options.isPublic),
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      isPublic: false
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

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

'use strict';

// Drones controller
angular.module('drones').controller('DronesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Drones',
  function ($scope, $stateParams, $location, Authentication, Drones) {
    $scope.authentication = Authentication;

    // Create new drone
    $scope.create = function () {
      // Create new drone object
      var drone = new Drones({
        title: this.title,
        content: this.content,
        dimension: this.dimension,
        weight: this.weight
      });

      // Redirect after save
      drone.$save(function (response) {
        $location.path('drones/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        $scope.dimension = '';
        $scope.weight = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing drone
    $scope.remove = function (drone) {
      if (drone) {
        drone.$remove();

        for (var i in $scope.drones) {
          if ($scope.drones[i] === drone) {
            $scope.drones.splice(i, 1);
          }
        }
      } else {
        $scope.drone.$remove(function () {
          $location.path('drones');
        });
      }
    };

    // Update existing drone
    $scope.update = function () {
      var drone = $scope.drone;

      drone.$update(function () {
        $location.path('drones/' + drone._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of drones
    $scope.find = function () {
      $scope.drones = Drones.query();
    };

    // Find existing drone
    $scope.findOne = function () {
      $scope.drone = Drones.get({
        droneId: $stateParams.droneId
      });
    };
  }
]);

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

    Menus.addSubMenuItem('topbar', 'flights', {
      roles: ['admin','user'],
      title: 'List Active Flights',
      state: 'flights.active'
    });
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'flights', {
      roles: ['user'],
      title: 'Create Flights',
      state: 'flights.create'
    });
  }
]);

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

'use strict';

// flights controller
angular.module('flights').controller('FlightsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Flights', '$http',
  function($scope, $stateParams, $location, Authentication, Flights, $http) {
    $scope.authentication = Authentication;

    $scope.exportAction = function (option) {
         switch (option) {
             case 'pdf': $scope.$broadcast('export-pdf', {});
                 break;
             case 'excel': $scope.$broadcast('export-excel', {});
                 break;
             case 'doc': $scope.$broadcast('export-doc', {});
                 break;
             case 'csv': $scope.$broadcast('export-csv', {});
                 break;
             default: console.log('no event caught');
         }
     };

    $scope.drones = [];

    $scope.getDrones = function (){
      $http({
        method: 'GET',
        url: '/api/drones'
      })
      .success(function(data, status){
        $scope.drones = data;
      })
      .error(function(data,status){
        alert('Error');
      });
    };

    $scope.checklists = [];

    $scope.getChecklists = function (){
      $http({
        method: 'GET',
        url: '/api/checklists'
      })
      .success(function(data, status){
        $scope.checklists = data;
      })
      .error(function(data, status){
        alert('error');
      });
    };

    $scope.concludeFlight = function (){
      return !this.flightActive;
    };

    // Create new flight
    $scope.create = function() {
      // Create new flight object
      var flight = new Flights({
        title: this.title,
        content: this.content,
        drone: $scope.drone,
        checklist: $scope.checklist,
        address: this.address,
        postFlightNotes: this.postFlightNotes
      });

      // Redirect after save
      flight.$save(function(response) {
        $location.path('flights/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        $scope.address = '';
        $scope.drone = '';
        $scope.checklist = '';
        $scope.postFlightNotes = '';

      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing flight
    $scope.remove = function(flight) {
      if (flight) {
        flight.$remove();

        for (var i in $scope.flights) {
          if ($scope.flights[i] === flight) {
            $scope.flights.splice(i, 1);
          }
        }
      } else {
        $scope.flight.$remove(function() {
          $location.path('flights');
        });
      }
    };

    // Update existing flight
    $scope.update = function() {
      var flight = $scope.flight;

      flight.$update(function() {
        $location.path('flights/' + flight._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of flights
    $scope.find = function() {
      $scope.flights = Flights.query();
    };

    // Find existing flight
    $scope.findOne = function() {
      $scope.flight = Flights.get({
        flightId: $stateParams.flightId
      });
    };
  }
]);

angular.module('flights').directive('exportTable', function(){
          var link = function ($scope, elm, attr) {
            $scope.$on('export-pdf', function (e, d) {
                elm.tableExport({ type: 'pdf', escape: false });
            });
            $scope.$on('export-excel', function (e, d) {
                elm.tableExport({ type: 'excel', escape: false });
            });
            $scope.$on('export-doc', function (e, d) {
                elm.tableExport({ type: 'doc', escape: false });
            });
            $scope.$on('export-csv', function (e, d) {
                elm.tableExport({ type: 'csv', escape: false });
            });
        };
        return {
            restrict: 'C',
            link: link
        };
});

'use strict';

//flights service used for communicating with the flights REST endpoints
angular.module('flights').factory('Flights', ['$resource',
  function ($resource) {
    return $resource('api/flights/:flightId', {
      flightId: '@_id'
    }, {
      get: { method:'GET', cache: false },
      query: { method:'GET', cache: false, isArray:true },
      update: {
        method: 'PUT'
      }
    });
  }
]);

'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/views/admin/user-list.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/views/admin/user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/views/admin/user-edit.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function () {
      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication',
  function ($scope, $state, $http, $location, $window, Authentication) {
    $scope.authentication = Authentication;

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function () {
      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function () {
      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      var redirect_to;

      if ($state.previous) {
        redirect_to = $state.previous.href;
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url + (redirect_to ? '?redirect_to=' + encodeURIComponent(redirect_to) : '');
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);

        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
