var app = angular.module("app", []);

app.controller('MainCtrl', function($scope, foo) {
  $scope.foo = foo;
});

app.provider('foo', function() {
  
  var thisIsPrivate = "Private";

  return {
    
    setPrivate: function(newVal) {
      thisIsPrivate = newVal; 
    },
    
    $get: function() {
      function getPrivate() {
        return thisIsPrivate;
      }
  
      return {
        variable: "This is public",
        getPrivate: getPrivate
      };
    } 
    
  };

});

app.config(function(fooProvider) {
  fooProvider.setPrivate('New value from config');
});