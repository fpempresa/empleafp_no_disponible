(function (undefined) {

    "use strict";
    /**
     * Servicio para crear ventana modales
     */
    Dialog.$inject = ['$rootScope', '$compile', '$http', '$q', '$controller', '$injector', '$sce', '$templateRequest', 'dialogDefinitionObjects'];
    function Dialog($rootScope, $compile, $http, $q, $controller, $injector, $sce, $templateRequest, dialogDefinitionObjects) {

        /**
         * Crea una nueva ventana modal pero no se muestra.
         * @param {name} name El nombre de la ventana modal. 
         * @param {Object} params Dato a pasar a la ventana modal
         * @returns {Promise} Un objeto Promise para obtener el resultado de la ventana.
         */
        this.create = function (name, params) {
            var deferred = $q.defer();
            var dialogDefinitionObject = dialogDefinitionObjects[name];

            if (!dialogDefinitionObject) {
                throw new Error("No existe ningún dialog con el nombre:"+name);
            }

            var promises = {};

            angular.extend(promises, getPromiseResolves(dialogDefinitionObject, params));
            angular.extend(promises, {
                '$dialogTemplate': getPromiseTemplate(dialogDefinitionObject, params)
            });

            $q.all(promises).then(function (promises) {
                var dialogTemplate = promises.$dialogTemplate;
                delete promises['$dialogTemplate'];
                var resolve = promises;

                var dialogElement = $("<div></div>");
                var dialogScope = $rootScope.$new();
                createJQueryUIDialogFromElement(dialogElement, dialogScope);
                var currentDialog = getCurrentDialogObject(dialogElement, dialogScope, params);
                dialogElement.html(dialogTemplate);
                var link = $compile(dialogElement.contents());
                var locals = {
                    $scope: dialogScope,
                    currentDialog: currentDialog,
                    $stateParams: params || {}
                };
                angular.extend(locals, resolve);
                var controller = $controller(dialogDefinitionObject.controller, locals);
                if (dialogDefinitionObject.controllerAs) {
                    dialogScope[dialogDefinitionObject.controllerAs] = controller;
                }
                dialogElement.data('$ngControllerController', controller);
                dialogElement.children().data('$ngControllerController', controller);
                link(dialogScope);

            }, function (error) {
                throw new Error("Fallo al resolver las promesas del Dialog:" + error);
            });


            return deferred.promise;


            function destroyDialog(scope, element) {
                scope.$destroy();
                element.dialog("close");
                element.dialog("destroy");
                element.remove();
            }

            function getCurrentDialogObject(dialogElement, dialogScope, params) {
                return {
                    closeOK: function (returnValue) {
                        destroyDialog(dialogScope, dialogElement);
                        deferred.resolve(returnValue);
                    },
                    closeCancel: function () {
                        destroyDialog(dialogScope, dialogElement);
                        deferred.reject(undefined);
                    },
                    open: function (options) {
                        if (options) {
                            for (var propertyName in options) {
                                var value = options[propertyName];
                                dialogElement.dialog("option", propertyName, value);
                            }
                        }
                        dialogElement.dialog("open");
                    },
                    params: params
                };
            }


            function getPromiseResolves(dialogDefinitionObject, params) {

                var promiseResolves = {};

                angular.forEach(dialogDefinitionObject.resolve, function (value, key) {
                    var locals = {
                        $stateParams:  params || {}
                    }
                    promiseResolves[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value, null, locals, key);
                });

                return promiseResolves;
            }


            function getPromiseTemplate(dialogDefinitionObject, params) {
                var dialogTemplate;
                if (dialogDefinitionObject.template) {
                    if (angular.isFunction(dialogDefinitionObject.template)) {
                        dialogTemplate = dialogDefinitionObject.template(params);
                    } else {
                        dialogTemplate = dialogDefinitionObject.template;
                    }
                } else if (dialogDefinitionObject.templateUrl) {
                    var templateUrl;
                    if (angular.isFunction(dialogDefinitionObject.templateUrl)) {
                        templateUrl = dialogDefinitionObject.templateUrl(params);
                    } else {
                        templateUrl = dialogDefinitionObject.templateUrl;
                    }
                    dialogTemplate = $templateRequest($sce.getTrustedResourceUrl(dialogDefinitionObject.templateUrl));
                } else {
                    throw new Error("Es requerido definir la propiedad template o templateUrl en un dialog");
                }

                return $q.when(dialogTemplate);
            }

            function createJQueryUIDialogFromElement(dialogElement, dialogScope) {
                dialogElement.dialog({
                    closeOnEscape: true,
                    modal: true,
                    autoOpen: false,
                    create: function (event, ui) {
                        $(dialogElement).closest('div.ui-dialog')
                                .find('button.ui-dialog-titlebar-close')
                                .click(function (e) {
                                    //Se llama con el botón de laspa de la ventana
                                    e.preventDefault();
                                    destroyDialog(dialogScope, dialogElement);
                                    deferred.reject(undefined);
                                });

                    }

                });
            }

        };

    }

    DialogProvider.$inject = [];
    function DialogProvider() {

        var dialogDefinitionObjects = {
        };


        this.when = function (name, dialogDefinitionObject) {
            dialogDefinitionObjects[name] = dialogDefinitionObject;
        };

        this.$get = ['$injector', function ($injector) {
                var locals = {
                    dialogDefinitionObjects: dialogDefinitionObjects
                };
                return $injector.instantiate(Dialog, locals);
            }];
    }

    angular.module("es.logongas.ix3").provider("dialog", DialogProvider);
})();



