angular.module("common").config(['repositoryFactoryProvider', function (repositoryFactoryProvider) {

        repositoryFactoryProvider.addExtendRepository("Usuario", ['repository', '$q', 'richDomain', function (repository, $q, richDomain) {

                repository.updateEstadoUsuario = function (idIdentity, estadoUsuario, expand) {
                    var deferred = $q.defer();

                    this.remoteDAO.updateEstadoUsuario(idIdentity, estadoUsuario, expand).then(function (data) {
                        richDomain.extend(data);
                        deferred.resolve(data);
                    }, function (data) {
                        richDomain.extend(data);
                        deferred.reject(data);
                    });

                    return deferred.promise;

                };

                repository.updateCentro = function (idIdentity, centro, expand) {
                    var deferred = $q.defer();

                    this.remoteDAO.updateCentro(idIdentity, centro, expand).then(function (data) {
                        richDomain.extend(data);
                        deferred.resolve(data);
                    }, function (data) {
                        richDomain.extend(data);
                        deferred.reject(data);
                    });

                    return deferred.promise;

                };

                repository.updatePassword = function (idIdentity, currentPassword, newPassword) {
                    var deferred = $q.defer();

                    this.remoteDAO.updatePassword(idIdentity, currentPassword, newPassword).then(function () {
                        deferred.resolve();
                    }, function (data) {
                        richDomain.extend(data);
                        deferred.reject(data);
                    });

                    return deferred.promise;

                };

                repository.enviarMailResetearContrasenya = function (email) {
                    var deferred = $q.defer();
                    this.remoteDAO.enviarMailResetearContrasenya(email).then(function () {
                        deferred.resolve();
                    }, function (data) {
                        richDomain.extend(data);
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };

                repository.resetearContrasenya = function (claveResetearContrasenya, nuevaContrasenya) {
                    var deferred = $q.defer();
                    this.remoteDAO.resetearContrasenya(claveResetearContrasenya, nuevaContrasenya).then(function () {
                        deferred.resolve();
                    }, function (data) {
                        richDomain.extend(data);
                        deferred.reject(data);
                    });
                    return deferred.promise;
                };

            }]);

    }]);