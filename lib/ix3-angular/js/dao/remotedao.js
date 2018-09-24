(function (undefined) {
    "use strict";

    /**
     * Esta es la clase RemoteDAO verdadera que genera el RemoteDAOFactory
     * @param {String} entityName Nombre de la entidad 
     * @param {String} ix3Configuration Configuracion de ix3 para obtener la URL base de API REST
     * @param {Http} $http Servicio de Http de AngularJS
     * @param {Q} $q Servicio de promesas de AngularJS
     */
    RemoteDAO.$inject = ['entityName', 'ix3Configuration', '$http', '$q', '$log'];
    function RemoteDAO(entityName, ix3Configuration, $http, $q, $log) {
        this.entityName = entityName;
        this.baseUrl = ix3Configuration.server.api;
        this.$http = $http;
        this.$q = $q;


        this.create = function (expand, parent) {
            var deferred = this.$q.defer();

            var params = {};
            if (parent) {
                angular.extend(params, parent);
            }
            if (expand) {
                params.$expand = expand;
            }

            var config = {
                method: 'GET',
                url: this.baseUrl + '/' + this.entityName + "/$create",
                params: params
            };

            this.$http(config).success(function (data, status, headers, config) {
                if (status === 204) {
                    //El 204 (no content) realmente es un null
                    deferred.resolve(null);
                } else {
                    deferred.resolve(data);
                }
            }).error(function (data, status, headers, config) {
                if (status === 400) {
                    deferred.reject(data);
                } else if (status === 0) {
                    //No hacemos nada. Suele ser cuando el navegador ha cancelado la petición y estamos cambiando de página
                    $log.info("Cancelada petición HTTP:" + config.url);
                } else {
                    throw new Error("Fallo al crear la entidad los datos:" + status + "\n" + data);
                }
            });

            return deferred.promise;
        };
        this.get = function (id, expand) {
            var deferred = this.$q.defer();

            var params = {};
            if (expand) {
                params.$expand = expand;
            }

            var config = {
                method: 'GET',
                url: this.baseUrl + '/' + this.entityName + "/" + id,
                params: params
            };

            this.$http(config).success(function (data, status, headers, config) {
                if (status === 204) {
                    //El 204 (no content) realmente es un null
                    deferred.resolve(null);
                } else {
                    deferred.resolve(data);
                }
            }).error(function (data, status, headers, config) {
                if (status === 400) {
                    deferred.reject(data);
                } else if (status === 0) {
                    //No hacemos nada. Suele ser cuando el navegador ha cancelado la petición y estamos cambiando de página     
                    $log.info("Cancelada petición HTTP:" + config.url);
                } else {
                    throw new Error("Fallo al obtener la entidad:" + status + "\n" + data);
                }
            });

            return deferred.promise;
        };
        this.insert = function (entity, expand) {
            var deferred = this.$q.defer();

            var params = {};
            if (expand) {
                params.$expand = expand;
            }

            var config = {
                method: 'POST',
                url: this.baseUrl + '/' + this.entityName,
                params: params,
                data: entity
            };

            this.$http(config).success(function (data, status, headers, config) {
                if (status === 204) {
                    //El 204 (no content) realmente es un null
                    deferred.resolve(null);
                } else {
                    deferred.resolve(data);
                }
            }).error(function (data, status, headers, config) {
                if (status === 400) {
                    deferred.reject(data);
                } else if (status === 0) {
                    //No hacemos nada. Suele ser cuando el navegador ha cancelado la petición y estamos cambiando de página    
                    $log.info("Cancelada petición HTTP:" + config.url);
                } else {
                    throw new Error("Fallo al insertar la entidad:" + status + "\n" + data);
                }
            });

            return deferred.promise;
        };
        this.update = function (id, entity, expand) {
            var deferred = this.$q.defer();

            var params = {};
            if (expand) {
                params.$expand = expand;
            }

            var config = {
                method: 'PUT',
                url: this.baseUrl + '/' + this.entityName + "/" + id,
                params: params,
                data: entity
            };

            this.$http(config).success(function (data, status, headers, config) {
                if (status === 204) {
                    //El 204 (no content) realmente es un null
                    deferred.resolve(null);
                } else {
                    deferred.resolve(data);
                }
            }).error(function (data, status, headers, config) {
                if (status === 400) {
                    deferred.reject(data);
                } else if (status === 0) {
                    //No hacemos nada. Suele ser cuando el navegador ha cancelado la petición y estamos cambiando de página    
                    $log.info("Cancelada petición HTTP:" + config.url);
                } else {
                    throw new Error("Fallo al insertar la entidad:" + status + "\n" + data);
                }
            });

            return deferred.promise;
        };
        this.delete = function (id) {
            var deferred = this.$q.defer();

            var params = {};

            var config = {
                method: 'DELETE',
                url: this.baseUrl + '/' + this.entityName + "/" + id,
                params: params
            };

            this.$http(config).success(function (data, status, headers, config) {
                if (status === 204) {
                    //El 204 (no content) realmente es un null
                    deferred.resolve(null);
                } else {
                    deferred.resolve(data);
                }
            }).error(function (data, status, headers, config) {
                if (status === 400) {
                    deferred.reject(data);
                } else if (status === 0) {
                    //No hacemos nada. Suele ser cuando el navegador ha cancelado la petición y estamos cambiando de página
                    $log.info("Cancelada petición HTTP:" + config.url);
                } else {
                    throw new Error("Fallo al borrar la entidad:" + status + "\n" + data);
                }
            });

            return deferred.promise;
        };
        this.search = function (query) {
            var deferred = this.$q.defer();
            query=query || {};
            
            var params = {};
            if (query.filters) {

                for (var key in query.filters) {
                    if (!query.filters.hasOwnProperty(key)) {
                        continue;
                    }


                    if (key.charAt(0) === "$") {
                        var operator = key.substr(1);
                        var filtersWithOperator = query.filters[key];  //Objeto con filtros cuya operador es "operator"

                        for (var propertyName in filtersWithOperator) {
                            if (!filtersWithOperator.hasOwnProperty(propertyName)) {
                                continue;
                            }

                            params[propertyName + "$" + operator + "" ] = filtersWithOperator[propertyName];
                        }
                    } else {
                        //Los filtros que cuelgan directamente son del tipo "EQ" y no hace falta poner nada.
                        params[key] = query.filters[key];
                    }

                }

            }
            if (query.orderby) {
                params.$orderby = "";
                for (var i = 0; i < query.orderby.length; i++) {
                    var simpleOrder = query.orderby[i];
                    if (params.$orderby !== "") {
                        params.$orderby = params.$orderby + ",";
                    }
                    params.$orderby = params.$orderby + simpleOrder.fieldName + " " + simpleOrder.orderDirection;
                }
            }

            if (query.expand) {
                params.$expand = query.expand;
            }
            if ((query.pageNumber >= 0) && (query.pageSize > 0)) {
                params.$pagenumber = query.pageNumber;
                params.$pagesize = query.pageSize;
            }
            
            if (query.distinct===true) {
                params.$distinct = true;
            } 
            
            if (query.namedSearch) {
                params.$namedsearch = query.namedSearch;
            }             

            var config = {
                method: 'GET',
                url: this.baseUrl + '/' + this.entityName,
                params: params
            };

            this.$http(config).success(function (data, status, headers, config) {
                if (status === 204) {
                    //El 204 (no content) realmente es un null
                    deferred.resolve(null);
                } else {
                    deferred.resolve(data);
                }
            }).error(function (data, status, headers, config) {
                if (status === 400) {
                    deferred.reject(data);
                } else if (status === 0) {
                    //No hacemos nada. Suele ser cuando el navegador ha cancelado la petición y estamos cambiando de página
                    $log.info("Cancelada petición HTTP:" + config.url);
                } else {
                    throw new Error("Fallo al buscar los datos:" + status + "\n" + data);
                }
            });

            return deferred.promise;
        };



        this.getChild = function (id, child, expand) {
            var deferred = this.$q.defer();

            var params = {};
            if (expand) {
                params.$expand = expand;
            }

            var config = {
                method: 'GET',
                url: this.baseUrl + '/' + this.entityName + "/" + id + "/" + child,
                params: params
            };

            this.$http(config).success(function (data, status, headers, config) {
                if (status === 204) {
                    //El 204 (no content) realmente es un array vacio
                    deferred.resolve(null);
                } else {
                    deferred.resolve(data);
                }
            }).error(function (data, status, headers, config) {
                if (status === 400) {
                    deferred.reject(data);
                } else if (status === 0) {
                    //No hacemos nada. Suele ser cuando el navegador ha cancelado la petición y estamos cambiando de página   
                    $log.info("Cancelada petición HTTP:" + config.url);
                } else {
                    throw new Error("Fallo al obtener la entidad hija:" + status + "\n" + data);
                }
            });

            return deferred.promise;
        };

        this.schema = function (expand) {
            var deferred = this.$q.defer();

            var params = {};
            if (expand) {
                params.$expand = expand;
            }

            var config = {
                method: 'GET',
                url: this.baseUrl + '/' + this.entityName + "/$schema",
                params: params
            };

            this.$http(config).success(function (data, status, headers, config) {
                if (status === 204) {
                    //El 204 (no content) realmente es un null
                    deferred.resolve(null);
                } else {
                    deferred.resolve(data);
                }
            }).error(function (data, status, headers, config) {
                if (status === 400) {
                    deferred.reject(data);
                } else if (status === 0) {
                    //No hacemos nada. Suele ser cuando el navegador ha cancelado la petición y estamos cambiando de página  
                    $log.info("Cancelada petición HTTP:" + config.url);
                } else {
                    throw new Error("Fallo al obtener los metadatos:" + status + "\n" + data);
                }
            });

            return deferred.promise;
        };

    }


    RemoteDAOFactory.$inject = ['$injector', 'extendRemoteDAO'];
    function RemoteDAOFactory($injector, extendRemoteDAO) {

        var remoteDAOs = {
        };

        this.getRemoteDAO = function (entityName) {
            if (!remoteDAOs[entityName]) {
                var locals = {
                    entityName: entityName
                };
                remoteDAOs[entityName] = $injector.instantiate(RemoteDAO, locals);

                if (extendRemoteDAO[entityName]) {
                    var locals = {
                        remoteDAO: remoteDAOs[entityName]
                    };
                    for (var i = 0; i < extendRemoteDAO[entityName].length; i++) {
                        $injector.invoke(extendRemoteDAO[entityName][i], undefined, locals);
                    }
                }

            }


            return remoteDAOs[entityName];
        };
    }

    RemoteDAOFactoryProvider.$inject = [];
    function RemoteDAOFactoryProvider() {
        var extendRemoteDAO = {
        };

        this.addExtendRemoteDAO = function (entityName, fn) {
            if (!extendRemoteDAO[entityName]) {
                extendRemoteDAO[entityName] = [];
            }
            extendRemoteDAO[entityName].push(fn);
        };

        this.$get = ['$injector', function ($injector) {
                var locals = {
                    extendRemoteDAO: extendRemoteDAO
                };
                return $injector.instantiate(RemoteDAOFactory, locals);
            }];
    }

    angular.module("es.logongas.ix3").provider("remoteDAOFactory", RemoteDAOFactoryProvider);

})();