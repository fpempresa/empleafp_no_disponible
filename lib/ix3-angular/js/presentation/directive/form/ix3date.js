"use strict";

angular.module("es.logongas.ix3").directive('ix3Date', ['$locale', 'dateFormat', function($locale, dateFormat) {
        //Poner moment con el mismo idioma que angular 
        moment.lang($locale.id);

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, element, attributes, ngModelController) {
                if (!attributes.ix3Date) {
                    attributes.ix3Date = dateFormat.getAngularFormatFromPredefined(dateFormat.getDefaultDateFormat());
                } else {
                    attributes.ix3Date = dateFormat.getAngularFormatFromPredefined(attributes.ix3Date);
                }

                //Esto es para hacer que en los mensajes se pueda usar elformato completo en vez de mostrar el predefinido.
                if (typeof (element.attr("ix3-date")) !== "undefined") {
                    element.attr("ix3-date", attributes.ix3Date);
                }
                if (typeof (element.attr("ix3:date")) !== "undefined") {
                    element.attr("ix3:date", attributes.ix3Date);
                }
                var pattern = dateFormat.getMomentFormatFromAngularJSFormat(attributes.ix3Date);
                var undefined;

                ngModelController.$formatters.push(function(value) {
                    if (angular.isDate(value) === true) {
                        ngModelController.$setValidity('date', true);
                        return moment(value).format(pattern);
                    } else if (value === null) {
                        ngModelController.$setValidity('date', true);
                        return "";
                    } else if (typeof (value) === "undefined") {
                        ngModelController.$setValidity('date', true);
                        return "";
                    } else {
                        ngModelController.$setValidity('date', false);
                        return "";
                    }
                });
                ngModelController.$parsers.push(function(value) {
                    if (value) {
                        var fecha = moment.utc(value, pattern, true);
                        if (fecha.isValid()) {

                            if (fecha.year() < 100) {
                                //cambiamos de 2 digitos a 1900 o 2000
                                var year;
                                var lowYear = fecha.year() + 1900;
                                var upperYear = fecha.year() + 2000;
                                var currentYear = moment().year();

                                if (Math.abs(currentYear - lowYear) <= (Math.abs(currentYear - upperYear))) {
                                    year = lowYear;
                                } else {
                                    year = upperYear;
                                }
                                fecha.year(year);
                                ngModelController.$setValidity('date', true);
                                return fecha.toDate();
                            } else if ((fecha.year() > 100) && (fecha.year() < 1800)) {
                                //No permitimos fechas menores de 1800 por si se ha colado el usuario
                                ngModelController.$setValidity('date', false);
                                return undefined;
                            } else {
                                //En cualquie otro caso el año es correcto.
                                ngModelController.$setValidity('date', true);
                                return fecha.toDate();
                            }

                            ngModelController.$setValidity('date', true);
                            return fecha.toDate();
                        } else {
                            ngModelController.$setValidity('date', false);
                            return undefined;
                        }
                    }
                });
            }
        };
    }]);
angular.module("es.logongas.ix3").config(['formValidatorProvider', function(formValidatorProvider) {
        //Incluir el mensaje de la nueva directiva de validacion
        formValidatorProvider.addErrorMensajePattern("date", "El formato de la fecha debe ser '{{ix3Date}}'");
    }]);