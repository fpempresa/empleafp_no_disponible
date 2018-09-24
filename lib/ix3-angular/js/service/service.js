(function (undefined) {
    "use strict";

    /**
     * Esta es la clase Service verdadera que genera el ServiceFactory
     * @param {String} entityName Nombre de la entidad 
     * @param {repository} repositoryFactory La factoria del reposotory para acceder a los datos
     * @param {Q} $q Servicio de promesas de AngularJS
     */
    Service.$inject = ['entityName', 'repositoryFactory', '$q', 'domainValidator'];
    function Service(entityName, repositoryFactory, $q, domainValidator) {
        var that = this;
        this.entityName = entityName;
        this.repository = repositoryFactory.getRepository(this.entityName);


        this.create = function (expand, parent) {
            var deferred = $q.defer();

            that.repository.create(expand, parent).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };
        this.get = function (id, expand) {
            var deferred = $q.defer();

            that.repository.get(id, expand).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };
        this.insert = function (entity, expand) {
            var deferred = $q.defer();

            that.repository.insert(entity, expand).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };
        this.update = function (id, entity, expand) {
            var deferred = $q.defer();

                that.repository.update(id, entity, expand).then(function (data) {

                    deferred.resolve(data);
                }, function (data) {

                    deferred.reject(data);
                });

            return deferred.promise;
        };
        this.delete = function (id) {
            var deferred = $q.defer();
            that.repository.delete(id).then(function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        };
        this.search = function (query) {
            var deferred = $q.defer();

            that.repository.search(query).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };
               
        this.getChild = function (id, child, expand) {
            var deferred = $q.defer();

            that.repository.getChild(id, child, expand).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        this.schema = function (expand) {
            var deferred = $q.defer();

            that.repository.schema(expand).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };


    }


    ServiceFactory.$inject = ['extendService', '$injector'];
    function ServiceFactory(extendService, $injector) {

        var repositories = {
        };

        this.getService = function (entityName) {

            if (!repositories[entityName]) {
                var locals = {
                    entityName: entityName
                };
                repositories[entityName] = $injector.instantiate(Service, locals);

                if (extendService[entityName]) {
                    var locals = {
                        service: repositories[entityName]
                    };

                    for (var i = 0; i < extendService[entityName].length; i++) {
                        $injector.invoke(extendService[entityName][i], undefined, locals);
                    }
                }

            }

            return repositories[entityName];
        };
    }


    ServiceFactoryProvider.$inject = [];
    function ServiceFactoryProvider() {

        var extendService = {
        };

        this.addExtendService = function (entityName, fn) {
            if (!extendService[entityName]) {
                extendService[entityName] = [];
            }
            extendService[entityName].push(fn);
        };

        this.$get = ['$injector', function ($injector) {
                var locals = {
                    extendService: extendService
                };
                return $injector.instantiate(ServiceFactory, locals);
            }];

    }



    angular.module("es.logongas.ix3").provider("serviceFactory", ServiceFactoryProvider);

})();


