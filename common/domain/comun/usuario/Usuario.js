"use strict";

angular.module("common").config(['richDomainProvider', function (richDomain) {

        richDomain.addEntityTransformer("Usuario", ['schemaEntities', function (schemaEntities) {
                var Usuario = {
                    getNombreCompleto: function () {
                        return this.nombre + (this.apellidos ? " " + this.apellidos : "");
                    },
                    getEstadoUsuarioDescription: function () {
                        return schemaEntities.getSchemaProperty(this.$propertyPath + ".estadoUsuario").getValueDescription(this.estadoUsuario);
                    },
                    getTipoUsuarioDescription: function () {
                        return schemaEntities.getSchemaProperty(this.$propertyPath + ".tipoUsuario").getValueDescription(this.tipoUsuario);
                    },
                    $validators: [
                        {
                            label: 'Confirmar Contraseña',
                            message: 'No es igual a la contraseña',
                            executeInActions: ['INSERT'],
                            rule: function () {
                                if (this.password === this.confirmPassword) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        },
                        {
                            label: "Condiciones y politicas",
                            message: 'Debe aceptar los terminos del servicio y la política de privacidad de FPempresa',
                            executeInActions: ['INSERT'],
                            rule: function () {
                                if (this.aceptarCondicionesPolitica === true) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    ]
                };

                return function (object, propertyPath) {
                    object.$propertyPath = propertyPath;
                    angular.extend(object, Usuario);
                };
            }]);

    }]);