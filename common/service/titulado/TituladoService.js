(function () {

    "use strict";

    angular.module("common").config(['serviceFactoryProvider', function (serviceFactoryProvider) {

            serviceFactoryProvider.addExtendService("Titulado", ['service', '$q', 'repositoryFactory', 'langUtil', 'session', function (service, $q, repositoryFactory, langUtil, session) {

                    service.usuarioRepository = repositoryFactory.getRepository("Usuario");

                    function getExpands(expands) {
                        var tituladoExpand = [];
                        var usuarioExpand = [];
                        var expandUsuario = true; //Indica si hay o no que cargar el usuario. siempre vale TRUE pq siempre se expandiria desde el servidor

                        if (expands) {
                            var arrExpands = langUtil.splitValues(expands, ",");

                            for (var i = 0; i < arrExpands.length; i++) {
                                var expand = arrExpands[i];

                                if (expand.indexOf("usuario.")===0) {
                                    expandUsuario = true;

                                    //Le he hemos quedatos la parte de "usuario."
                                    usuarioExpand.push(expand.substr(8));

                                } else if (expand === "usuario") {
                                    expandUsuario = true;
                                } else {
                                    tituladoExpand.push(expand);
                                }
                            }
                        }

                        return {
                            tituladoExpand: tituladoExpand.join(","),
                            usuarioExpand: usuarioExpand.join(","),
                            expandUsuario: expandUsuario
                        }

                    }


                    service.get = function (id, expand) {
                        var deferred = $q.defer();

                        var expands = getExpands(expand);

                        service.repository.get(id, expands.tituladoExpand).then(function (titulado) {

                            if ((expands.expandUsuario) && (titulado)) {
                                var query = {
                                    namedSearch:"getUsuarioFromTitulado",
                                    filters:{
                                        titulado: titulado.idTitulado
                                    },
                                    expand:expands.usuarioExpand
                                }
                                
                                service.usuarioRepository.search(query).then(function (usuario) {
                                    titulado.usuario = usuario;
                                    deferred.resolve(titulado);
                                }, function (data) {
                                    deferred.reject(data);
                                });
                            } else {
                                deferred.resolve(titulado);
                            }


                        }, function (data) {
                            deferred.reject(data);
                        });

                        return deferred.promise;
                    };

                    service.insert = function (entity, expand) {
                        var deferred = $q.defer();

                        this.repository.insert(entity, expand).then(function (data) {
                            session.logged().then(function() {
                                deferred.resolve(data);
                            }, function (data) {
                                deferred.reject(data);
                            });
                        }, function (data) {
                            deferred.reject(data);
                        });

                        return deferred.promise;
                    };

                    service.update = function (id, entity, expand) {
                        var deferred = $q.defer();

                        this.repository.update(id, entity, expand).then(function (data) {
                            session.logged().then(function() {
                                deferred.resolve(data);
                            }, function (data) {
                                deferred.reject(data);
                            });
                        }, function (data) {
                            deferred.reject(data);
                        });

                        return deferred.promise;
                    };

                }]);

        }]);

})();