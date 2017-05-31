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
