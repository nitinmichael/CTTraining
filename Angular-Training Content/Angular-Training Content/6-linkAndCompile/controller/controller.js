(function(){

    var app = angular.module("compiler", []);

    app.controller("mainController", function($scope){
        $scope.label = "Hello!";
    });

     app.directive("simple", function(){
        return {
            restrict: "EA",
            transclude:true,
            template:"<div>{{label}}<div ng-transclude></div></div>",
            compile: function(element, attributes){
                console.log("simple compile", arguments);
                return {
                    pre: function(scope, element, attributes, controller, transcludeFn){
                        console.log("simple pre", arguments);
                    },
                    post: function(scope, element, attributes, controller, transcludeFn){
                        console.log("simple post", arguments);
                    }
                }
            },
            controller: function($scope, $element){
                console.log("simple controller", arguments)
            }
        };
    });


}());
