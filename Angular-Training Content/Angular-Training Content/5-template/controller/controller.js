(function (angular) {
    'use strict';
    var app=angular.module('simpleDirective', []);
        
      app.directive('myCustomer', function () {
            return {
                template: 'Name: {{customer.name}} Address: {{customer.address}}',
                replace: true,
                controller:function ($scope) {
            $scope.customer = {
                name: 'Naomi',
                address: '1600 Amphitheatre'
            };
            }
            }
      });
        
})(window.angular);