var app = angular.module("app", []);

app.controller('MainCtrl', function($scope, foo) {
  $scope.foo = foo;
});

app.service('foo', function() {
  var thisIsPrivate = "Private";
  this.variable = "This is public";
  this.getPrivate = function() {
    return thisIsPrivate;
  };
});

// This is the same as the service.
app.factory('foo2', function() {
  return new Foobar();
});


function Foobar() {
  var thisIsPrivate = "Private";
  this.variable = "This is public";
  this.getPrivate = function() {
    return thisIsPrivate;
  };
}

// Or even this
app.service('foo3', Foobar);