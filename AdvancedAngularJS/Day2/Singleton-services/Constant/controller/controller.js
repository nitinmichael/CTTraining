var app = angular.module("app", []);

app.controller('MainCtrl', function($scope, fooConfig) {
  $scope.fooConfig = fooConfig;
});

app.constant('fooConfig', {
  config1: true,
  config2: "Default config2"
});