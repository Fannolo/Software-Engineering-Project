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
