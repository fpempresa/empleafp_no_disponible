"use strict";

angular.module("common").config(['richDomainProvider', function (richDomain) {

        richDomain.addEntityTransformer("Centro", ['schemaEntities', function (schemaEntities) {
                var Centro = {
                    getEstadoCentroDescription: function () {
                        return schemaEntities.getSchemaProperty(this.$propertyPath + ".estadoCentro").getValueDescription(this.estadoCentro);
                    }
                };

                return function (object, propertyPath) {
                    object.$propertyPath=propertyPath;
                    angular.extend(object, Centro);
                };
            }]);

    }]);

