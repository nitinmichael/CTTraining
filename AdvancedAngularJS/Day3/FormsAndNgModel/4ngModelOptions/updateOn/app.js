(function(angular) {
  'use strict';
angular.module('optionsExample', [])
  .controller('ExampleController', ['$scope', function($scope) {
    $scope.user = { name: 'John', data: '' };

    $scope.cancel = function(e) {
      if (e.keyCode == 27) {
        $scope.userForm.userName.$rollbackViewValue();
      }
    };
  }]);
})(window.angular);

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/