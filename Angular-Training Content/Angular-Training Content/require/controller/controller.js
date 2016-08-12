var App = angular.module('App', []);
 
App.directive('powerSwitch', function() {
  return {
    restrict: 'A',
    controller: function($scope, $element, $attrs) {
      $scope.state = 'on';
 
      $scope.toggle = function() {
        $scope.$apply(function() {
          $scope.state = ($scope.state === 'on' ? 'off' : 'on');
        });
      };
 
      this.getState = function() {
        return $scope.state;
      };
    },
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        scope.toggle();
      });
 
      scope.$watch('state', function(newVal, oldVal) {
        if (newVal === 'off') {
          element.addClass('disabled');
        } else {
          element.removeClass('disabled');
        }
      });
    }  
  };
});
 
App.directive('lightbulb', function() {
  return {
    restrict: 'A',
    require: '^powerSwitch',
    link: function(scope, element, attrs, controller) {
      scope.$watch(function() {
        scope.bulb = controller.getState();
      });
    }
  };
});