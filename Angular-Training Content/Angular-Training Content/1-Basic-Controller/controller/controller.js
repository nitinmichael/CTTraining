/**
 * Created by Rohan Vidhan on 12/1/2015.
 */
angular.module('myApp', []).controller('personCtrl', function($scope) {
    $scope.firstName = "John",
        $scope.lastName = "Doe",
        $scope.fullName = function() {
            return $scope.firstName + " " + $scope.lastName;
        }
});
/*Talk about
    1)External file creation and ctrl methods.
    2)Controller Object
    3)DI .Inject $log and show array based notation
    */