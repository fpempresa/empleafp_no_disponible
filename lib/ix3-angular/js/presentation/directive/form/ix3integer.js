"use strict";

angular.module("es.logongas.ix3").directive('ix3Integer', [function() {
        
        
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, element, attributes, ngModelController) {

                var regExpInteger = new RegExp("^[-+]?\\d*$");
                var undefined;

                ngModelController.$formatters.push(function(value) {
                    if (value === null) {
                        ngModelController.$setValidity('integer', true);
                        return "";
                    } else if (typeof (value) === "undefined") {
                        ngModelController.$setValidity('integer', true);
                        return "";
                    } else if (regExpInteger.test(value+"")===true) {
                        ngModelController.$setValidity('integer', true);
                        return value;
                    } else {
                        ngModelController.$setValidity('integer', false);
                        return "";
                    }
                });
                ngModelController.$parsers.unshift(function(value) {
                    if (value) {
                        if (regExpInteger.test(value+"")===true) {
                            ngModelController.$setValidity('integer', true);
                            return parseInt(value+"");
                        } else {
                            ngModelController.$setValidity('integer', false);
                            return undefined;
                        }
                    }
                });
            }
        };
    }]);
angular.module("es.logongas.ix3").config(['formValidatorProvider', function(formValidatorProvider) {
        //Incluir el mensaje de la nueva directiva de validacion
        formValidatorProvider.addErrorMensajePattern("integer", "El dato debe ser un número");
    }]);