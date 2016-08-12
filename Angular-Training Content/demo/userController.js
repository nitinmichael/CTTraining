(function(){
  var myApp=angular.module('app',[]).controller('myCtrl',['$scope','$log',function($scope,$log){
      $scope.trainingName='AngularTraining';
      $scope.logName=function(){
          $log.log('Logging Name:'+$scope.user.name);
      };
  }]);  
})();
