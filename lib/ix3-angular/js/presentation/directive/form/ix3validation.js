"use strict";

angular.module("es.logongas.ix3").directive('ix3Validation', ['$compile','schemaEntities', function($compile, schemaEntities) {

        return {
            restrict: 'A',
            terminal: true,
            require:"^ix3Form",
            priority: 10000,
            compile: function(element, attributes) {
                return {
                    pre: function($scope, element, attributes) {

                    },
                    post: function($scope, element, attributes, ix3FormController) {
                        var schemaProperty;
                        if (attributes.ix3SchemaProperty) {
                            schemaProperty = schemaEntities.getSchemaProperty(attributes.ix3SchemaProperty);
                            if (!schemaProperty) {
                                throw Error("No existe la metainformación de :" + attributes.ix3SchemaProperty);
                            }
                        } else {
                            var propertyName = attributes.ngModel.replace(new RegExp("^" + ix3FormController.getConfig().modelPropertyName + "\."), "");
                            var schema = schemaEntities.getSchema(ix3FormController.getConfig().entity);
                            
                            if (!schema) {
                                throw Error("No existe la metainformación de la entidad :" + ix3FormController.getConfig().entity);
                            }
                            
                            schemaProperty = schema.getSchemaProperty(propertyName);
                            
                            if (!schemaProperty) {
                                throw Error("No existe la metainformación de la propiedad :" + ix3FormController.getConfig().entity + "." + propertyName);
                            }
                        }                        

                        //Expresion regular
                        var pattern=schemaProperty.pattern;
                        if (pattern!==null) {
                            element.attr("ng-pattern",new RegExp("^("+pattern+")$") );
                        }
                        
                        //Valor requirido
                        var required=schemaProperty.required;
                        if (required===true) {
                            element.attr("ng-required",required);
                        }
                        
                        //Tamaño máximo
                        var maxLength=schemaProperty.maxLength;
                        if (maxLength!==null) {
                            element.attr("ng-maxlength",maxLength);
                        }
                        
                        //Tamaño mínimo
                        var minLength=schemaProperty.minLength;
                        if (minLength!==null) {
                            element.attr("ng-minlength",minLength);
                        }                           
                        
                        
                        //Valor máximo
                        var maximum=schemaProperty.maximum;
                        if (maximum!==null) {
                            element.attr("max",maximum);
                        }
                        
                        //Valor mínimo
                        var minimum=schemaProperty.minimum;
                        if (minimum!==null) {
                            element.attr("min",minimum);
                        }                        
                        
                        var format=schemaProperty.format;
                        if (format==="URL") {
                            element.attr("type","url");
                        } else if (format==="EMAIL") {
                            element.attr("type","email");
                        }                          
                        
                        element.removeAttr("ix3-validation"); //Se quita para evitar el bucle infinito de compilaciones
                        element.removeAttr("data-ix3-validation"); //Se quita para evitar el bucle infinito de compilaciones
                        element.removeAttr("x-ix3-validation"); //Se quita para evitar el bucle infinito de compilaciones
                        $compile(element)($scope);
                    }
                }
            }
        };
    }]);

