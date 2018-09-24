"use strict";

angular.module("common").config(['richDomainProvider', function (richDomain) {

        richDomain.addEntityTransformer("Empresa", ['schemaEntities', function (schemaEntities) {

                return function (object, propertyPath) {
                    object.toString=function() {
                        return this.nombreComercial;
                    };
                };
            }]);

    }]);

