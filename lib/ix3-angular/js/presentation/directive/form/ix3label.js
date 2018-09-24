"use strict";
angular.module("es.logongas.ix3").directive('ix3Label', ['$document', 'directiveUtil', 'schemaEntities', function ($document, directiveUtil, schemaEntities) {

        return {
            restrict: 'A',
            require: "^ix3Form",
            compile: function (element, attributes) {
                return {
                    pre: function ($scope, element, attributes, ix3FormController) {
                        var schemaProperty;
                        if (attributes.ix3SchemaProperty) {
                            schemaProperty = schemaEntities.getSchemaProperty(attributes.ix3SchemaProperty);
                            if (!schemaProperty) {
                                throw Error("No existe la metainformación de :" + attributes.ix3SchemaProperty);
                            }
                        } else {
                            var forId = attributes.for;
                            var inputElement = $document[0].getElementById(forId);
                            if (!inputElement) {
                                throw new Error("No existe el elemento input al que hace referencia el for del label:" + forId);
                            }

                            var forElementIx3SchemaProperty = directiveUtil.getAttributeValueFromNormalizedName(inputElement, "ix3SchemaProperty");
                            
                            if (forElementIx3SchemaProperty) {
                                schemaProperty = schemaEntities.getSchemaProperty(forElementIx3SchemaProperty);
                                if (!schemaProperty) {
                                    throw Error("No existe la metainformación de :" + forElementIx3SchemaProperty);
                                }
                            } else {
                                var forElementNgModel = directiveUtil.getAttributeValueFromNormalizedName(inputElement, "ngModel");



                                var propertyName = forElementNgModel.replace(new RegExp("^" + ix3FormController.getConfig().modelPropertyName + "\."), "");
                                var schema = schemaEntities.getSchema(ix3FormController.getConfig().entity);

                                if (!schema) {
                                    throw Error("No existe la metainformación de la entidad :" + ix3FormController.getConfig().entity);
                                }

                                schemaProperty = schema.getSchemaProperty(propertyName);

                                if (!schemaProperty) {
                                    throw Error("No existe la metainformación de la propiedad :" + ix3FormController.getConfig().entity + "." + propertyName);
                                }
                            }
                        }

                        var value = schemaProperty.label;
                        if ((value === undefined) || (value === null) || (value.trim() === "")) {
                            //Si no está el label usamos el nombre de la propia propiedad
                            value = propertyName;
                        }
                        value = value.charAt(0).toUpperCase() + value.slice(1);

                        element.text(value);

                    },
                    post: function ($scope, element, attributes) {
                    }
                };
            }
        };
    }]);