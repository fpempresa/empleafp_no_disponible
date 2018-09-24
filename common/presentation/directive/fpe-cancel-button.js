"use strict";

angular.module("common").directive('fpeCancelButton', ['getContextPath',function(getContextPath) {
        return {
            restrict: 'E',
            transclude: true,
            scope:true,
            templateUrl: getContextPath() + '/common/presentation/directive/fpe-cancel-button.html',
            link: function($scope, element, attributes) {
            }
        };
    }]);

