var app = angular.module('mainModule', []);

function createDirective(name, priority) {
    return function () {
        return {
            restrict: 'EA'
            , compile: function (tElem, tAttrs) {
                console.log(name + ': compile');
                return {
                    pre: function (scope, iElem, iAttrs) {
                        console.log(name + ': pre link');
                    }
                    , post: function (scope, iElem, iAttrs) {
                        console.log(name + ': post link');
                    }
                }
            }
            , priority: priority
        }
    }
}

app.directive('levelOne', createDirective('levelOne', 100));
app.directive('levelTwo', createDirective('levelTwo', 100));
app.directive('levelThree', createDirective('levelThree', 100));