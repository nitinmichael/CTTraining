var app = angular.module("app", []);

app.controller('MainCtrl', function($scope, foo) {
  $scope.foo = foo;
});

app.value('foo', 'A simple value');