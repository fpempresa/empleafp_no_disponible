"use strict";

angular.module("common").config(['richDomainProvider', function (richDomain) {

        richDomain.addEntityTransformer("Titulado", ['schemaEntities', function (schemaEntities) {
                var Titulado = {
                    getTipoDocumentoDescription: function () {
                        return schemaEntities.getSchemaProperty(this.$propertyPath + ".tipoDocumento").getValueDescription(this.tipoDocumento);
                    }
                };

                return function (object, propertyPath) {
                    object.$propertyPath=propertyPath;                    
                    angular.extend(object, Titulado);
                };
            }]);

    }]);