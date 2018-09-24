"use strict";

angular.module("common").directive('currentdate', ['$filter',function($filter) {
        return {
            restrict: 'E',
            replace:true,
            template: '<span>{{value}}</span>',
            scope: {
            },
            link: function($scope, element, attributes) {
                var now=new Date();
                var format=attributes.format || 'yyyy';
                $scope.value = $filter('date')(now, format);
            }
        };
    }]);


