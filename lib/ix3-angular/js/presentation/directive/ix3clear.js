"use strict";

angular.module("es.logongas.ix3").directive('ix3Clear', ['langUtil',function(langUtil) {
    return {
        restrict: 'A',
        link: function($scope, element, attributes) {



            var clear = attributes.ix3Clear;
            var clearValue = attributes.ix3ClearValue;
            var ngModel = attributes.ngModel;
            if (clearValue === undefined) {
                clearValue = "null";//Es un String pq luego se hace un "$eval"
            }

            if ($scope.$eval(clear) === true) {
                langUtil.setValue($scope, ngModel, $scope.$eval(clearValue));
            }

            $scope.$watch(clear, function(newValue, oldValue) {
                if (newValue === true) {
                    langUtil.setValue($scope, ngModel, $scope.$eval(clearValue));
                }
            });

        }
    };
}]);


