"use strict";

angular.module('es.logongas.ix3').provider("formValidator", [function () {
        function FormValidatorProvider() {
            this.errorMensajePatterns = {
                required: "No puede estar vacio.",
                email: "No tiene el formato de correo electrónico",
                maxlength: "Debe tener un tamaño menor o igual a {{ngMaxlength||maxlength}}",
                minlength: "Debe tener un tamaño mayor o igual a {{ngMinlength||minlength}}",
                pattern: "El formato no es válido: '{{ngPattern}}'",
                min: "Debe ser un valor mayor o igual a {{min}}",
                max: "Debe ser un valor menor o igual a {{max}}",
                url: "No tiene el formato de una URL",
                integer: "El valor '{{$value}}' no es un número"
            };
            this.addErrorMensajePattern = function (error, messajePattern) {
                this.errorMensajePatterns[error] = messajePattern;
            };
            this.$get = ['$interpolate', '$injector', 'directiveUtil', function ($interpolate, $injector, directiveUtil) {
                    return new FormValidator($interpolate, $injector, directiveUtil, this.errorMensajePatterns);
                }];
        }

        function FormValidator($interpolate, $injector, directiveUtil, errorMensajePatterns) {
            var that = this;
            this.errorMensajePatterns = errorMensajePatterns;

            function getMessage(inputElement, errorType) {

                var messagePattern = that.errorMensajePatterns[errorType];
                if (typeof (messagePattern) === "undefined") {
                    messagePattern = errorType;
                }

                var message;
                if (inputElement) {
                    var attributes = {
                        "$value": inputElement.val()
                    };
                    var realInputElement = inputElement[0];
                    for (var i = 0; i < realInputElement.attributes.length; i++) {
                        var normalizedAttributeName = directiveUtil.normalizeName(realInputElement.attributes[i].nodeName);
                        attributes[normalizedAttributeName] = directiveUtil.getAttributeValueFromNormalizedName(realInputElement, normalizedAttributeName);
                    }
                    message = $interpolate(messagePattern)(attributes);
                } else {
                    message = messagePattern;
                }
                return message;
            }

            /**
             * Dado el nombre de un "input" obtiene el label asociado
             * @param {element} inputElement Elemento del que se busca el label
             * @param {string} defaultLabel El label por defecto si no se encuentra ningún otro label
             */
            function getLabel(inputElement, defaultLabel) {
                var label;

                if ((inputElement) && (inputElement.attr('id'))) {
                    var labelElement = $('label[for="' + inputElement.attr('id') + '"]');
                    if (labelElement.length > 0) {
                        label = $(labelElement[0]).text();
                    } else {
                        label = defaultLabel;
                    }
                } else {
                    label = defaultLabel;
                }

                return label;
            }

            /**
             * Genera la propiedad Label de una lista de mensajes
             * @param {BusinessMessages} businessMessages La lista ala que se añade la propiedad Label
             * @param {Formelement} formElement El formulario que contiene los elementos para poder obtener de él, los labels
             * @returns {BusinessMessages} La lista de entrada pero con la propieda label
             */
            function generateLabels(businessMessages, formElement) {
                for (var i = 0; i < businessMessages.length; i++) {
                    var businessMessage = businessMessages[i];
                    if (!businessMessage.label) {
                        var propertyName = businessMessage.propertyName;
                        if (propertyName) {
                            var inputElement = $("[name='" + propertyName + "']", formElement);
                            if (inputElement) {
                                var label = getLabel(inputElement, propertyName);
                                businessMessage.label = label;
                            }
                        }
                    }
                }
            }

            this.validate = function (angularForm, validators) {
                var businessMessages = [];

                var formElement = $("form[name='" + angularForm.$name + "']");

                for (var propertyName in angularForm) {
                    if (typeof (propertyName) === "string" && propertyName.charAt(0) !== "$") {
                        if (angularForm[propertyName].$error) {
                            for (var errorType in angularForm[propertyName].$error) {
                                if (angularForm[propertyName].$error[errorType] === true) {
                                    var inputElement = $("[name='" + propertyName + "']", formElement);
                                    businessMessages.push({
                                        propertyName: propertyName,
                                        message: getMessage(inputElement, errorType)
                                    });
                                }

                            }
                        }
                    }
                }

                //Ejecutamos las validaciones personalizadas pero solo si no hay mensajes "normales"
                //Esto se hace pq normalmente las validaciones personalizadas necesitan de los campos requeridos
                if ((businessMessages.length === 0) && (validators)) {
                    for (var i = 0; i < validators.length; i++) {
                        var customValidation = validators[i];
                        if (customValidation.rule() === false) {
                            businessMessages.push({
                                propertyName: getTextFromInterpolateStringOrFunction(customValidation.propertyName, undefined),
                                label: getTextFromInterpolateStringOrFunction(customValidation.label, undefined),
                                message: getTextFromInterpolateStringOrFunction(customValidation.message, undefined)
                            });
                        }
                    }
                }

                generateLabels(businessMessages, formElement);

                return businessMessages;
            };

            function getTextFromInterpolateStringOrFunction(stringOrFunction, thisObject) {
                var text;
                if (stringOrFunction) {
                    if ((typeof (stringOrFunction) === 'function') || (Array.isArray(stringOrFunction))) {
                        text = $injector.invoke(stringOrFunction, thisObject);
                    } else if (typeof (stringOrFunction) === 'string') {
                        text = $interpolate(stringOrFunction)(thisObject);
                    } else {
                        throw new Error("El argumento sfn debe ser una función o un String pero es de tipo:" + typeof (stringOrFunction) + " valor:" + stringOrFunction);
                    }
                } else {
                    //Si no hay nada , no hay texto
                    text = "";
                }

                return text;
            }


        }



        return new FormValidatorProvider();

    }]);


