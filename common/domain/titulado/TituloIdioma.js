"use strict";

angular.module("common").config(['richDomainProvider', function (richDomain) {

        richDomain.addEntityTransformer("TituloIdioma", ['schemaEntities', function (schemaEntities) {
                var TituloIdioma = {
                    getNombreIdioma: function () {
                        if (this.idioma === "OTRO") {
                            return this.otroIdioma;
                        } else {
                            return schemaEntities.getSchemaProperty(this.$propertyPath + ".idioma").getValueDescription(this.idioma);
                        }
                    },
                    getNivelIdiomaDescription: function () {
                        return schemaEntities.getSchemaProperty(this.$propertyPath + ".nivelIdioma").getValueDescription(this.nivelIdioma);
                    }
                };


                return function (object, propertyPath) {
                    object.$propertyPath=propertyPath;
                    angular.extend(object, TituloIdioma);
                };
            }]);

    }]);
