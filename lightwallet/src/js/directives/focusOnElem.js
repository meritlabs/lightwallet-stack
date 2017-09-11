'use strict';

angular.module('copayApp.directives')
    .directive('focusOn', function() {
        return function(scope, elem, attr) {
            scope.$on('focusOn', function(e, name) {
                if(name === attr.focusOn) {
                    elem[0].focus();
                }
            });
        };
    });

angular.module('copayApp.directives')
    .factory('focus', function($rootScope, $timeout) {
    return function(name) {
        $timeout(function(){
            $rootScope.$broadcast('focusOn', name);
        })
    }
});