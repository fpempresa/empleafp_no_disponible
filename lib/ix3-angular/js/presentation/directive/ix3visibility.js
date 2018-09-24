"use strict";

angular.module('es.logongas.ix3').directive('ix3Visibility', function() {
    return {
        restrict: 'A',
        link: function($scope, element, attributes) {
            function mostrar(element) {
                element.css({visibility: "visible"});
            }
            function ocultar(element) {
                element.css({visibility: "hidden"});
            }

            var expression = attributes.ix3Visibility;
            if ($scope.$eval(expression) === true) {
                mostrar(element);
            } else {
                ocultar(element);
            }

            $scope.$watch(expression, function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (newValue === true) {
                    mostrar(element);
                } else {
                    ocultar(element);
                }

            });
        }
    };
});


