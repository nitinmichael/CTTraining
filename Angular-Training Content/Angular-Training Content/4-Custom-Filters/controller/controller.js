(function(angular) {
  'use strict';
angular.module('myReverseFilterApp', [])
  .filter('reverse', function() {
    return function(input, uppercase) {
      input = input || '';
      var out = "";
      for (var i = 0; i < input.length; i++) {
        out = input.charAt(i) + out;
      }
      // conditional based on optional argument
      if (uppercase) {
        out = out.toUpperCase();
      }
      return out;
    };
  })
  .controller('MyController', ['$scope','$filter', function($scope,$filter) {
    $scope.greeting = 'hello';
      $scope.myName='Rohan';
      $scope.myName=$filter('reverse')($scope.myName,true);                        
      
        
  }]);
})(window.angular);