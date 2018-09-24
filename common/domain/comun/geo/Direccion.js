"use strict";

angular.module("common").config(['richDomainProvider', function (richDomain) {

        richDomain.addEntityTransformer("Direccion", ['schemaEntities', function (schemaEntities) {
                var Direccion = {

                };

                return function (object, propertyPath) {
                    object.$propertyPath=propertyPath;                    
                    angular.extend(object, Direccion);
                };
            }]);

    }]);