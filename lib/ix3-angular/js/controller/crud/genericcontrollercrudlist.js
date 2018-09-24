"use strict";

(function () {

    GenericControllerCrudList.$inject = ['serviceFactory', '$location', 'schemaEntities'];
    function GenericControllerCrudList(serviceFactory, $location, schemaEntities) {
        this.extendScope = function (scope, controllerParams) {
            scope.models = {};
            scope.filters = {
                $eq: {},
                $ne: {},
                $gt: {},
                $ge: {},
                $lt: {},
                $le: {},
                $like: {},
                $llike: {},
                $liker: {},
                $lliker: {},
                $isnull: {}
            };
            scope.orderby = []; //Array con objetos con las propiedades fieldName y orderDirection. La propiedad orderDirection soporta los valores "ASC" y "DESC"
            scope.distinct = false;
            scope.page = {};
            scope.businessMessages = null;
            scope.namedSearch = undefined;
            angular.extend(scope, controllerParams);
            scope.service = serviceFactory.getService(scope.entity);
            scope.idName = schemaEntities.getSchema(scope.entity).primaryKeyPropertyName;
            scope.prefixRoute = $location.url().substr(0,$location.url().lastIndexOf("/search")); //Indica como empiezan las URLs de las rutas
            scope.preSearch = function (filters) {

            };
            //Paginacion y busqueda
            if (!scope.page.pageNumber) {
                scope.page.pageNumber = 0;
            }
            scope.page.totalPages = undefined;
            scope.$watch("page.pageNumber", function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                scope.search();
            });
            scope.$watch("page.pageSize", function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                scope.page.pageNumber = 0;
                scope.search();
            });
            scope.$watch("order", function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                scope.page.pageNumber = 0;
                scope.search();
            }, true);



            scope.search = function () {

                var filters = angular.copy(scope.filters);
                if (scope.parentProperty && scope.parentId) {
                    filters[scope.parentProperty] = scope.parentId;
                }
                scope.preSearch(filters);
                var query = {
                    filters: filters,
                    orderby: scope.orderby,
                    expand: scope.expand,
                    pageNumber: scope.page.pageNumber,
                    pageSize: scope.page.pageSize,
                    distinct: scope.distinct,
                    namedSearch: scope.namedSearch
                };
                var promise = scope.service.search(query);


                promise.then(function (data) {
                    if (angular.isArray(data)) {
                        scope.models = data;
                    } else {
                        //Si no es un array es un objeto "Page" Y lo comprobamos
                        if (data.hasOwnProperty("pageNumber") && data.hasOwnProperty("content") && data.hasOwnProperty("totalPages")) {
                            //Comprobamos este IF pq puede hbaer varias peticiones AJAX en curso y solo queremos la actual
                            if (scope.page.pageNumber === data.pageNumber) {
                                scope.models = data.content;
                                scope.page.totalPages = data.totalPages;
                            }
                        } else {
                            throw Error("Los datos retornados por el servidor no son un objeto 'Page'");
                        }
                    }
                }, function (businessMessages) {
                    scope.businessMessages = businessMessages;
                });
            };




            scope.buttonSearch = function () {
                scope.page.pageNumber = 0;
                scope.search();
            };
            scope.buttonNew = function () {
                var newPath = getPathAction("new", scope.prefixRoute, undefined, scope.parentProperty, scope.parentId);
                $location.path(newPath).search({});
            };
            scope.buttonEdit = function (id) {
                var newPath = getPathAction("edit", scope.prefixRoute, id, scope.parentProperty, scope.parentId);
                $location.path(newPath).search({});
            };
            scope.buttonDelete = function (id) {
                var newPath = getPathAction("delete", scope.prefixRoute, id, scope.parentProperty, scope.parentId);
                $location.path(newPath).search({});
            };
            scope.buttonView = function (id) {
                var newPath = getPathAction("view", scope.prefixRoute, id, scope.parentProperty, scope.parentId);
                $location.path(newPath).search({});
            };


            /**
             * Obtiene el path a navegar para una acción  un formulario
             * @param {String} actionName La accion:"new","edit","delete" o "view". Corresponde a las parte del path de las rutas.
             * @param {String} prefixRoute como empieza la URL de la ruta. Debe incluir el "/"
             * @param {Object} pk El valor de la clave primaria
             * @param {String} parentProperty El nombre de la propiedad padre que se asocia
             * @param {Object} parentId El valor de la propiedad 'parentProperty'
             * @returns {String} El Path a navegar. No se incluye la "#".
             */
            function getPathAction(actionName, prefixRoute, pk, parentProperty, parentId) {
                var path = prefixRoute + "/" + actionName;
                if (pk) {
                    path = path + "/" + pk;
                }
                if ((parentProperty) && (parentId)) {
                    if (typeof (parentId) !== "string") {
                        throw Error("El tipo del argumento parentId debe ser un String pq es el nombre de una propiedad y no su valor");
                    }

                    path = path + "/" + parentProperty + "/" + parentId;
                }
                return path;
            }



        };
    }

    angular.module('es.logongas.ix3').service("genericControllerCrudList", GenericControllerCrudList);

}());

