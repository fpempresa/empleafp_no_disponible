angular.module("common").config(['serviceFactoryProvider', function (serviceFactoryProvider) {

        serviceFactoryProvider.addExtendService("Usuario", ['service', '$q', 'session', function (service, $q, session) {
                service.updateEstadoUsuario = function (idIdentity, estadoUsuario, expand) {
                    var deferred = $q.defer();

                    this.repository.updateEstadoUsuario(idIdentity, estadoUsuario, expand).then(function (usuario) {
                        if (usuario.idIdentity === session.getUser().idIdentity) {
                            //Si cambian los datos del usuario y es el que está logeado , actualizamos los datos del usaurio logeado
                            session.setUser(usuario);
                        }
                        deferred.resolve(usuario);
                    }, function (data) {
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };
                service.updateCentro = function (idIdentity, centro, expand) {
                    var deferred = $q.defer();

                    this.repository.updateCentro(idIdentity, centro, expand).then(function (usuario) {
                        if (usuario.idIdentity === session.getUser().idIdentity) {
                            //Si cambian los datos del usuario y es el que está logeado , actualizamos los datos del usaurio logeado
                            session.setUser(usuario);
                        }
                        deferred.resolve(usuario);
                    }, function (data) {
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };
                service.updatePassword = function (idIdentity, currentPassword, newPassword) {
                    var deferred = $q.defer();

                    this.repository.updatePassword(idIdentity, currentPassword, newPassword).then(function () {
                        deferred.resolve();
                    }, function (data) {
                        deferred.reject(data);
                    });

                    return deferred.promise;
                };

                service.enviarMailResetearContrasenya = function (mail) {
                    var deferred = $q.defer();
                    this.repository.enviarMailResetearContrasenya(mail).then(function () {
                        deferred.resolve();
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };

                service.resetearContrasenya = function (claveResetearContrasenya, newPassword) {
                    var deferred = $q.defer();
                    this.repository.resetearContrasenya(claveResetearContrasenya, newPassword).then(function () {
                        deferred.resolve();
                    }, function (data) {
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };

                service.update = function (id, entity, expand) {
                    var deferred = $q.defer();

                    this.repository.update(id, entity, expand).then(function (usuario) {
                        if (usuario.idIdentity === session.getUser().idIdentity) {
                            //Si cambian los datos del usuario y es el que está logeado , actualizamos los datos del usaurio logeado
                            session.setUser(usuario);
                        }
                        deferred.resolve(usuario);
                    }, function (businessMessages) {
                        deferred.reject(businessMessages);
                    });

                    return deferred.promise;
                };

                this.get = function (id, expand) {
                    var deferred = $q.defer();

                    this.repository.get(id, expand).then(function (usuario) {
                        if (usuario.idIdentity === session.getUser().idIdentity) {
                            //Si leemos los datos del usuario del que está logeado , actualizamos los datos del usaurio logeado
                            //Pq seguro que son mas recientes.
                            session.setUser(usuario);
                        }

                        deferred.resolve(usuario);
                    }, function (businessMessages) {
                        deferred.reject(businessMessages);
                    });

                    return deferred.promise;
                };

            }]);

    }]);