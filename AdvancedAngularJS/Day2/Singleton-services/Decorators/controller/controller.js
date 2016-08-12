var app = angular.module("app", []);

app.controller('MainCtrl', function($scope, foo) {
  $scope.foo = foo;
});

app.factory('foo', function() {
  var thisIsPrivate = "Private";
  function getPrivate() {
    return thisIsPrivate;
  }
  
  return {
    variable: "This is public",
    getPrivate: getPrivate
  };
});

app.config(function($provide) {
  $provide.decorator('foo', function($delegate) {
    $delegate.greet = function() {
      return "Hello, I am a new function of 'foo'";
    };
    
    return $delegate;
  });
});