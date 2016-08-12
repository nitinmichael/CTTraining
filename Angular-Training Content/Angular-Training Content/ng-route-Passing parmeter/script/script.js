var sampleApp = angular.module('sampleApp', ['ngRoute']);

sampleApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/ShowOrder/:orderId', {
	templateUrl: 'view/show_orders.html',
	controller: 'ShowOrderController'
      });
}]);


sampleApp.controller('ShowOrderController', function($scope, $routeParams) {

	
	$scope.order_id = $routeParams.orderId;

});