"use strict";

(function () {

    GenericControllerCrudDetail.$inject = ['serviceFactory', '$window', 'formValidator', '$location', 'schemaEntities', '$q', ];
    function GenericControllerCrudDetail(serviceFactory, $window, formValidator, $location, schemaEntities, $q) {

        this.extendScope = function (scope, controllerParams) {
            scope.labelButtonOK = null;
            scope.labelButtonCancel = null;
            scope.model = {};
            scope.models = {};
            scope.businessMessages = null;
            angular.extend(scope, controllerParams);
            scope.service = serviceFactory.getService(scope.entity);
            scope.idName = schemaEntities.getSchema(scope.entity).primaryKeyPropertyName;
            scope.childPrefixRoute = "/" + scope.entity.toLowerCase();
            scope.runningOKAction=false;
            scope.preCreate = function () {
            };
            scope.postCreate = function () {
            };
            scope.preGet = function () {
            };
            scope.postGet = function () {
            };
            scope.preInsert = function () {
            };
            scope.postInsert = function () {
            };
            scope.preUpdate = function () {
            };
            scope.postUpdate = function () {
            };
            scope.preDelete = function () {
            };
            scope.postDelete = function () {
            };


            scope.doGet = function () {
                var defered = $q.defer();

                scope.preGet();
                scope.service.get(scope.id, scope.expand).then(function (data) {
                    if (data === null) {
                        //Si retornamos null, realmente lo transformamo en un objeto sin datos, pq sino fallan los select
                        scope.model = {};
                    } else {
                        scope.model = data;
                    }
                    scope.businessMessages = null;

                    scope.postGet();
                    defered.resolve(data);
                }, function (businessMessages) {
                    scope.businessMessages = businessMessages;
                    defered.reject(businessMessages);
                });

                return defered.promise;
            };

            scope.doCreate = function () {
                var defered = $q.defer();

                var parent = {};
                if ((scope.parentProperty) && (scope.parentId)) {
                    parent[scope.parentProperty] = scope.parentId;
                }
                scope.preCreate();
                scope.service.create(scope.expand, parent).then(function (data) {
                    scope.model = data;
                    scope.businessMessages = null;

                    scope.postCreate();
                    defered.resolve(data);
                }, function (businessMessages) {
                    scope.businessMessages = businessMessages;
                    defered.reject(businessMessages);
                });

                return defered.promise;
            };

            scope.doInsert = function () {
                var defered = $q.defer();

                scope.preInsert();
                scope.businessMessages = formValidator.validate(scope.mainForm, scope.$validators);
                if (scope.businessMessages.length === 0) {
                    scope.service.insert(scope.model, scope.expand).then(function (data) {
                        scope.model = data;
                        scope.businessMessages = null;
                        scope.controllerAction = "EDIT";
                        scope.id = scope.model[scope.idName];

                        scope.postInsert();
                        defered.resolve(data);
                    }, function (businessMessages) {
                        scope.businessMessages = businessMessages;
                        defered.reject(businessMessages);
                    });
                } else {
                    defered.reject(scope.businessMessages);
                }
                return defered.promise;
            };

            scope.doUpdate = function () {
                var defered = $q.defer();

                scope.preUpdate();
                scope.businessMessages = formValidator.validate(scope.mainForm, scope.$validators);
                if (scope.businessMessages.length === 0) {
                    scope.service.update(scope.id, scope.model, scope.expand).then(function (data) {
                        scope.model = data;
                        scope.businessMessages = null;

                        scope.postUpdate();
                        defered.resolve(data);
                    }, function (businessMessages) {
                        scope.businessMessages = businessMessages;
                        defered.reject(businessMessages);
                    });
                } else {
                    defered.reject(scope.businessMessages);
                }

                return defered.promise;
            };

            scope.doDelete = function () {
                var defered = $q.defer();

                scope.preDelete()
                scope.service.delete(scope.id).then(function (data) {
                    scope.businessMessages = null;

                    scope.postDelete();
                    defered.resolve(data);
                }, function (businessMessages) {
                    scope.businessMessages = businessMessages;
                    defered.reject(businessMessages);
                });

                return defered.promise;
            };

            scope.finishOK = function (oldControllerAction) {
                setTimeout(function () {  //http://stackoverflow.com/questions/13853844/angular-js-ie-error-10-digest-iterations-reached-aborting
                    $window.history.back();
                }, 0);
            };
            scope.finishCancel = function () {  //http://stackoverflow.com/questions/13853844/angular-js-ie-error-10-digest-iterations-reached-aborting
                setTimeout(function () {
                    $window.history.back();
                }, 0);
            };



            scope.buttonCancel = function () {
                scope.finishCancel();
            };
            scope.buttonOK = function () {
                var oldControllerAction = scope.controllerAction;
                
                if (scope.isInOKAction()===true) {
                    return;
                }
                
                scope.startOKAction();
                switch (scope.controllerAction) {
                    case "NEW":
                        scope.doInsert().then(function () {
                            scope.finishOK(oldControllerAction);
                        })["finally"](function() {
                            scope.endOKAction();
                        });
                        break;
                    case "EDIT":
                        scope.doUpdate().then(function () {
                            scope.finishOK(oldControllerAction);
                        })["finally"](function() {
                            scope.endOKAction();
                        });
                        break;
                    case "VIEW":
                        scope.endOKAction();
                        scope.finishOK(oldControllerAction);
                        break;
                    case "DELETE":
                        scope.doDelete().then(function () {
                            scope.finishOK(oldControllerAction);
                        })["finally"](function() {
                           scope.endOKAction(); 
                        });
                        break;
                    default:
                        scope.endOKAction();
                        throw Error("scope.controllerAction desconocida:" + scope.controllerAction);
                }

            };

            scope.$watch("controllerAction", function (controllerAction) {
                switch (controllerAction) {
                    case "NEW":
                        scope.labelButtonOK = "Guardar";
                        scope.labelButtonCancel = "Salir";
                        break;
                    case "EDIT":
                        scope.labelButtonOK = "Actualizar";
                        scope.labelButtonCancel = "Salir";
                        break;
                    case "VIEW":
                        scope.labelButtonOK = "Salir";
                        scope.labelButtonCancel = "";
                        break;
                    case "DELETE":
                        scope.labelButtonOK = "Borrar";
                        scope.labelButtonCancel = "Salir";
                        break;
                    default:
                        throw Error("scope.controllerAction desconocida:" + scope.controllerAction);
                }
            });


            scope.isInOKAction = function () {
                return (scope.runningOKAction===true);
            };

            scope.startOKAction = function () {
                scope.runningOKAction=true;
                document.getElementsByTagName("body")[0].style.cursor = "progress";
            };
            scope.endOKAction = function () {
                scope.runningOKAction=false;
                document.getElementsByTagName("body")[0].style.cursor = "default";
            };            
            


            /**
             * Accion a realizar al iniciar el controlador
             */
            function init() {
                //
                switch (scope.controllerAction) {
                    case "NEW":
                        scope.doCreate();
                        break;
                    case "EDIT":
                        scope.doGet();
                        break;
                    case "VIEW":
                        scope.doGet();
                        break;
                    case "DELETE":
                        scope.doGet();
                        break;
                    default:
                        throw Error("scope.controllerAction desconocida:" + scope.controllerAction);
                }
            }

            /***************************************************/
            /************ METODOS REFERIDOS A CHILD ************/
            /*** BEGIN ***/


            scope.buttonDefaultChild = function (entity, pk, parentProperty, parentId) {
                var actionName;
                switch (scope.controllerAction) {
                    case "NEW":
                        actionName = "edit";
                        break;
                    case "EDIT":
                        actionName = "edit";
                        break;
                    case "VIEW":
                        actionName = "view";
                        break;
                    case "DELETE":
                        actionName = "view";
                        break;
                    default:
                        throw Error("scope.controllerAction desconocida:" + scope.controllerAction);
                }
                scope.childAction(actionName, entity, pk, parentProperty, parentId);
            };
            scope.buttonNewChild = function (entity, pk, parentProperty, parentId) {
                scope.childAction("new", entity, pk, parentProperty, parentId);
            };
            scope.buttonEditChild = function (entity, pk, parentProperty, parentId) {
                scope.childAction("edit", entity, pk, parentProperty, parentId);
            };
            scope.buttonDeleteChild = function (entity, pk, parentProperty, parentId) {
                scope.childAction("delete", entity, pk, parentProperty, parentId);
            };
            scope.buttonViewChild = function (entity, pk, parentProperty, parentId) {
                scope.childAction("view", entity, pk, parentProperty, parentId);
            };


            scope.childAction = function (actionName, entity, pk, parentProperty, parentId) {

                //comprobar si podemos hacer esa accion;
                if (!scope.allowChildAction(actionName)) {
                    scope.businessMessages = [{
                            propertyName: null,
                            message: "No es posible realizar un :'" + actionName + "'"
                        }];

                    return;
                }

                switch (scope.controllerAction) {
                    case "NEW":
                        //Antes de hacer cualquier accion hay que insertar la fila
                        scope.doInsert().then(function () {
                            //Tenemos OBLIGATORIAMENTE AQUI que calcular el valor del path pq al ser un INSERT
                            //aun no había clave primaria y aqui lo volvemos a calcular
                            $location.path(getPathChildAction(scope, actionName, scope.childPrefixRoute, pk, parentProperty, parentId)).search({});
                        });
                        break;
                    case "EDIT":
                        //Antes de hacer cualquier accion hay que actualizar la fila
                        scope.doUpdate().then(function () {
                            $location.path(getPathChildAction(scope, actionName, scope.childPrefixRoute, pk, parentProperty, parentId)).search({});
                        });
                        break;
                    case "VIEW":
                        $location.path(getPathChildAction(scope, actionName, scope.childPrefixRoute, pk, parentProperty, parentId)).search({});
                        break;
                    case "DELETE":
                        $location.path(getPathChildAction(scope, actionName, scope.childPrefixRoute, pk, parentProperty, parentId)).search({});
                        break;
                    default:
                        throw Error("scope.controllerAction desconocida:" + scope.controllerAction);
                }
            };

            /**
             * Obtiene el path a navegar para una acción "hija" de un formulario
             * @param {Scope} scope El scope para obtener los datos de la PK
             * @param {String} actionName La accion:"new","edit","delete" o "view". Corresponde a las parte del path de las rutas.
             * @param {String} childPrefixRoute Como empieza la URL de la ruta. Debe incluir el "/"
             * @param {Object} pk El valor de la clave primaria
             * @param {String} parentProperty El nombre de la propiedad padre que se asocia
             * @param {Object} parentId El valor de la propiedad 'parentProperty'
             * @returns {String} El Path a navegar. No se incluye la "#".
             */
            function getPathChildAction(scope, actionName, childPrefixRoute, pk, parentProperty, parentId) {
                var path = childPrefixRoute + "/" + actionName;
                if (pk) {
                    path = path + "/" + pk;
                }
                if ((parentProperty) && (parentId)) {
                    if (typeof (parentId) !== "string") {
                        throw Error("El tipo del argumento parentId debe ser un String pq es el nombre de una propiedad y no su valor");
                    }
                    path = path + "/" + parentProperty + "/" + scope.$eval(parentId);
                }
                return path;
            }

            scope.allowChildAction = function (actionName) {
                var allow;

                switch (scope.controllerAction) {
                    case "NEW":
                        allow = true;
                        break;
                    case "EDIT":
                        allow = true;
                        break;
                    case "VIEW":
                        //Solo se permite la accion view
                        if (actionName === "view") {
                            allow = true;
                        } else {
                            allow = false;
                        }
                        break;
                    case "DELETE":
                        //Solo se permite la accion view
                        if (actionName === "view") {
                            allow = true;
                        } else {
                            allow = false;
                        }
                        break;
                    default:
                        throw Error("scope.controllerAction desconocida:" + scope.controllerAction);
                }

                return allow;
            };

            /*** END ***/
            /***************************************************/
            /************ METODOS REFERIDOS A CHILD ************/


            init();

        };


    }

    angular.module('es.logongas.ix3').service("genericControllerCrudDetail", GenericControllerCrudDetail);

})();