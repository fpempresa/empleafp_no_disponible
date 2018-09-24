"use strict";

angular.module("common").directive('crudDetailButtons', ['getContextPath',function(getContextPath) {
        return {
            restrict: 'E',
            replace:true,
            transclude: true,
            scope:true,
            templateUrl: getContextPath() + '/common/presentation/directive/cruddetailbuttons.html',
            link: function($scope, element, attributes) {
                $scope.hideCancel=$scope.$eval(attributes.hideCancel || false);
                $scope.hideOK=$scope.$eval(attributes.hideOK || false);
            }
        };
    }]);


