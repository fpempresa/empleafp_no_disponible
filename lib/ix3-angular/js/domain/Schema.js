"use strict";

angular.module('es.logongas.ix3').config(['richDomainProvider', function (richDomain) {

        richDomain.addEntityTransformer("Schema", ['langUtil', function (langUtil) {

                var Schema = {
                    getSchemaProperty: function (propertyName) {
                        propertyName = propertyName || "";
                        if (propertyName.indexOf(",") >= 0) {
                            throw new Error("No se permiten comas en el nombre de la propiedad");
                        }

                        var keys = langUtil.splitValues(propertyName, ".");
                        var current = this;
                        for (var i = 0; i < keys.length; i++) {
                            current = current.properties[keys[i]];

                            if (current === undefined) {
                                break;
                            }
                        }
                        if (current === undefined) {
                            return null;
                        } else {
                            return current;
                        }
                    }
                };


                return function (object, propertyPath) {
                    angular.extend(object, Schema)
                };

            }]);








    }]);