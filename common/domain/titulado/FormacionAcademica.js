"use strict";

angular.module("common").config(['richDomainProvider', function (richDomain) {

        richDomain.addEntityTransformer("FormacionAcademica", ['schemaEntities', function (schemaEntities) {
                var FormacionAcademica = {
                    getNombreCentro: function () {
                        if (this.tipoFormacionAcademica === "CICLO_FORMATIVO") {
                            if (this.centro.idCentro < 0) {
                                return this.otroCentro;
                            } else {
                                return this.centro.toString();
                            }
                        } else {
                            return this.otroCentro;
                        }
                    },
                    getNombreTitulo: function () {
                        if (this.tipoFormacionAcademica === "CICLO_FORMATIVO") {
                            return this.ciclo.toString();
                        } else {
                            return this.otroTitulo;
                        }
                    },
                    toStringFormacionAcademica: function () {
                        return this.getNombreTitulo() + "-" + this.getNombreCentro();
                    },
                    getTipoFormacionAcademicaDescription: function () {
                        return schemaEntities.getSchemaProperty(this.$propertyPath + ".tipoFormacionAcademica").getValueDescription(this.tipoFormacionAcademica);
                    }
                };

                return function (object, propertyPath) {
                    object.$propertyPath=propertyPath;                    
                    angular.extend(object, FormacionAcademica);
                };
            }]);

    }]);