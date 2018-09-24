(function (undefined) {
    "use strict";

    /**
     * Esta es la clase Repository verdadera que genera el RepositoryFactory
     * @param {String} entityName Nombre de la entidad 
     * @param {remoteDAO} remoteDAOFactory La factoria del DAO para acceder a los datos
     * @param {RichDomain} richDomain Añadir nuevos métodos a los objetos de negocio que se leen
     * @param {Q} $q Servicio de promesas de AngularJS
     */
    Repository.$inject = ['entityName', 'remoteDAOFactory', 'richDomain', '$q', 'domainValidator'];
    function Repository(entityName, remoteDAOFactory, richDomain, $q, domainValidator) {
        var that = this;
        this.entityName = entityName;
        this.remoteDAO = remoteDAOFactory.getRemoteDAO(this.entityName);


        this.create = function (expand, parent) {
            var deferred = $q.defer();

            that.remoteDAO.create(expand, parent).then(function (data) {
                richDomain.extend(data);
                deferred.resolve(data);
            }, function (data) {
                richDomain.extend(data);
                deferred.reject(data);
            });

            return deferred.promise;
        };
        this.get = function (id, expand) {
            var deferred = $q.defer();

            that.remoteDAO.get(id, expand).then(function (data) {
                richDomain.extend(data);
                deferred.resolve(data);
            }, function (data) {
                richDomain.extend(data);
                deferred.reject(data);
            });

            return deferred.promise;
        };
        this.insert = function (entity, expand) {
            var deferred = $q.defer();

            domainValidator.validate(entity, "INSERT").then(function () {
                that.remoteDAO.insert(entity, expand).then(function (data) {
                    richDomain.extend(data);
                    deferred.resolve(data);
                }, function (data) {
                    richDomain.extend(data);
                    deferred.reject(data);
                });
            }, function (businessMessages) {
                deferred.reject(businessMessages);
            });

            return deferred.promise;
        };
        this.update = function (id, entity, expand) {
            var deferred = $q.defer();
            domainValidator.validate(entity, "UPDATE").then(function () {
                that.remoteDAO.update(id, entity, expand).then(function (data) {
                    richDomain.extend(data);
                    deferred.resolve(data);
                }, function (data) {
                    richDomain.extend(data);
                    deferred.reject(data);
                });
            }, function (businessMessages) {
                deferred.reject(businessMessages);
            });
            return deferred.promise;
        };
        this.delete = function (id) {
            var deferred = $q.defer();
            that.remoteDAO.delete(id).then(function (data) {
                richDomain.extend(data);
                deferred.resolve(data);
            }, function (data) {
                richDomain.extend(data);
                deferred.reject(data);
            });

            return deferred.promise;
        };
        this.search = function (query) {
            var deferred = $q.defer();

            that.remoteDAO.search(query).then(function (data) {
                //OJO:!!!!!!Hay que comprobar si lo que retornamos no es un objeto "Page" pq en ese caso se enriquece solo su contenido!!!!!!
                if ((typeof (query.pageNumber) !== "undefined") && (typeof (query.pageSize) !== "undefined") && (typeof (data.content) !== "undefined")) {
                    richDomain.extend(data.content);
                } else {
                    richDomain.extend(data);
                }
                deferred.resolve(data);
            }, function (data) {
                richDomain.extend(data);
                deferred.reject(data);
            });

            return deferred.promise;
        };
          
        this.getChild = function (id, child, expand) {
            var deferred = $q.defer();

            that.remoteDAO.getChild(id, child, expand).then(function (data) {
                richDomain.extend(data);
                deferred.resolve(data);
            }, function (data) {
                richDomain.extend(data);
                deferred.reject(data);
            });

            return deferred.promise;
        };

        this.schema = function (expand) {
            var deferred = $q.defer();

            that.remoteDAO.schema(expand).then(function (data) {
                richDomain.extend(data);
                deferred.resolve(data);
            }, function (data) {
                richDomain.extend(data);
                deferred.reject(data);
            });

            return deferred.promise;
        };


    }


    RepositoryFactory.$inject = ['extendRepository', '$injector'];
    function RepositoryFactory(extendRepository, $injector) {

        var repositories = {
        };

        this.getRepository = function (entityName) {

            if (!repositories[entityName]) {
                var locals = {
                    entityName: entityName
                };
                repositories[entityName] = $injector.instantiate(Repository, locals);

                if (extendRepository[entityName]) {
                    var locals = {
                        repository: repositories[entityName]
                    };

                    for (var i = 0; i < extendRepository[entityName].length; i++) {
                        $injector.invoke(extendRepository[entityName][i], undefined, locals);
                    }
                }

            }

            return repositories[entityName];
        };
    }


    RepositoryFactoryProvider.$inject = [];
    function RepositoryFactoryProvider() {

        var extendRepository = {
        };

        this.addExtendRepository = function (entityName, fn) {
            if (!extendRepository[entityName]) {
                extendRepository[entityName] = [];
            }
            extendRepository[entityName].push(fn);
        };

        this.$get = ['$injector', function ($injector) {
                var locals = {
                    extendRepository: extendRepository
                };
                return $injector.instantiate(RepositoryFactory, locals);
            }];

    }



    angular.module("es.logongas.ix3").provider("repositoryFactory", RepositoryFactoryProvider);

})();


