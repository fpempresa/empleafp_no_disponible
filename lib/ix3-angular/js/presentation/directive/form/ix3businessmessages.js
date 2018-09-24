"use strict";

angular.module('es.logongas.ix3').directive('ix3BusinessMessages', ['ix3Configuration', function(ix3Configuration) {
        return {
            restrict: 'E',
            replace:true,
            template: '<div data-ng-show="realScope.businessMessages.length > 0">' +
                    '       <div ng-class="{\'alert-error\':bootstrap.version===2,\'alert-danger\':bootstrap.version>=3}" style="text-align:left" class="alert"  >' +
                    '           <button type="button" class="close" ng-click="realScope.businessMessages=[]">&times;</button>' +
                    '           <strong>Se han producido los siguientes errores:</strong>' +
                    '           <ul >' +
                    '               <li data-ng-repeat="businessMessage in realScope.businessMessages">' +
                    '                   <strong data-ng-hide="((businessMessage.propertyName == null) || (businessMessage.propertyName == \'\')) && ((businessMessage.label == null) || (businessMessage.label == \'\'))">{{businessMessage.label || businessMessage.propertyName}}:&nbsp;&nbsp;</strong>{{businessMessage.message}}' +
                    '               </li>' +
                    '           </ul>' +
                    '       </div>' +
                    '</div>',
            scope: {
            },
            link: function($scope, element, attributes) {
                $scope.bootstrap = ix3Configuration.bootstrap;
                
                $scope.realScope=null;
                var scope=$scope;
                while (scope.$parent) {
                    scope=scope.$parent;
                    if (scope.hasOwnProperty('businessMessages')) {
                        $scope.realScope=scope;
                        break;
                    }
                }
                
                if ($scope.realScope==null) {
                    throw Error("No existe la propiedad businessMessages en el scope.");
                }
            }
        };
    }]);
