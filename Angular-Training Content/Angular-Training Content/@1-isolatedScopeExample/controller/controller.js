var app = angular.module('drinkApp', []);

app.controller("AppCtrl", function ($scope) {
})

/*
app.directive("drink", function () {
    return {
        scope: {}
        , template: '<div>{{ flavor }}</div>'
        , link: function (scope, element, attrs) {
            scope.flavor = attrs.flavor;
        }
    };
});*/

app.directive("drink", function () {
    return {
        scope: {
            flavor: "@"
        }
        , template: '<div>{{ flavor }}</div>'
    , };
});