(function (angular) {
    'use strict';
    angular.module('simpleDirective', [])
        .controller('simpleController', ['$scope', function ($scope) {
            $scope.customer = {
                name: 'Naomi',
                address: '1600 Amphitheatre'
            };
  }])
        .directive('myCustomer', function () {
            return {
                template: 'Name: {{customer.name}} Address: {{customer.address}}'
            };
        });
})(window.angular);