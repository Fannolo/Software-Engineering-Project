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
        content: this.content
      });

      // Redirect after save
      drone.$save(function (response) {
        $location.path('drones/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
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
