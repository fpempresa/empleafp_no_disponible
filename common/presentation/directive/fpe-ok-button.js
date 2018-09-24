angular.module("common").directive('fpeOkButton', ['getContextPath',function(getContextPath) {
        return {
            restrict: 'E',
            replace:true,
            scope:true,
            templateUrl: getContextPath() + '/common/presentation/directive/fpe-ok-button.html',
            link: function($scope, element, attributes) {
            }
        };
    }]);