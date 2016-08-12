var app = angular.module('plunker', []);

app.controller('MainCtrl', function() {
  var vm = this;
  
  vm.pretty = false;
  vm.buttonLabel = 'Make Pretty!';
  
  vm.toggle = function() {
    vm.pretty = !vm.pretty;
    vm.buttonLabel = vm.pretty ? 'Make Boring' : 'Make Pretty!';
  };
  
});



app.directive('makePretty', function() {

  function randomPrettyColour() {
    var prettyColours = ['Chartreuse', 'Fuchsia', 'MediumPurple', 'Yellow', 'PeachPuff', 'HotPink', 'FireBrick', 'Aqua', 'DeepSkyBlue', 'Peru', 'NavajoWhite', 'MistyRose'];
    return prettyColours[Math.floor(Math.random() * prettyColours.length)]
  }

  return {
    link: function(scope, element, attrs) {
        console.log(element.length);

      function makeBoring() {
        
          angular.forEach(element, function(el) {

          if (el.nodeType === Node.ELEMENT_NODE) {
            angular.element(el).css({
              'color': '',
              'background-color': ''
            });
          }

        });
        
      }

      function makePretty() {

        angular.forEach(element, function(el) {

          if (el.nodeType === Node.ELEMENT_NODE) {
            angular.element(el).css({
              'color': randomPrettyColour(),
              'background-color': randomPrettyColour()
            });
          }

        });

      }
      
      scope.$watch(function() {
        return attrs.makePretty;
      }, function(newVal, oldVal) {
        if (newVal !== 'false') {
          makePretty();
        } else {
          makeBoring();
        }
      });
      
    }
  };
});