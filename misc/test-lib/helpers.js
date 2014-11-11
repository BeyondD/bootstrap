// jasmine matcher for expecting an element to have a css class
// https://github.com/angular/angular.js/blob/master/test/matchers.js
beforeEach(function() {
  jasmine.addMatchers({
    toHaveClass: function() {
      return {
        compare: function(actual, cls) {
          var result = {};
          result.pass = actual.hasClass(cls);

          if(result.pass) {
            result.message = "Expected '" + actual + "' not to have class '" + cls + "'.";
          } else {
            result.message = "Expected '" + actual + "' to have class '" + cls + "'.";
          }

          return result;
        }
      }
    },
    toBeHidden: function() {
      return {
        compare: function(actual) {
          var result = {},
            element = angular.element(actual);

          result.pass = element.hasClass('ng-hide') || element.css('display') == 'none';

          return result;
        }
      }
    }
  });
});
