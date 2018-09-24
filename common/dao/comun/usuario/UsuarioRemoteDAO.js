angular.module("common").config(['remoteDAOFactoryProvider', function (remoteDAOFactoryProvider) {

        remoteDAOFactoryProvider.addExtendRemoteDAO("Usuario", ['remoteDAO', function (remoteDAO) {
                remoteDAO.updateEstadoUsuario = function (idIdentity, estadoUsuario, expand) {
                    var deferred = this.$q.defer();

                    var params = {};
                    if (expand) {
                        params.$expand = expand;
                    }

                    var config = {
                        method: 'PATCH',
                        url: this.baseUrl + '/' + this.entityName + "/" + idIdentity + "/estadoUsuario/" + estadoUsuario,
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
                        } else {
                            throw new Error("Fallo al insertar la entidad:" + status + "\n" + data);
                        }
                    });

                    return deferred.promise;
                };

                remoteDAO.updateCentro = function (idIdentity, centro, expand) {
                    var deferred = this.$q.defer();

                    var params = {};
                    if (expand) {
                        params.$expand = expand;
                    }

                    var config = {
                        method: 'PATCH',
                        url: this.baseUrl + '/' + this.entityName + "/" + idIdentity + "/centro/" + centro.idCentro,
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
                        } else {
                            throw new Error("Fallo al actualizar el centro:" + status + "\n" + data);
                        }
                    });

                    return deferred.promise;
                };


                remoteDAO.updatePassword = function (idIdentity, currentPassword, newPassword) {
                    var deferred = this.$q.defer();

                    var data = {
                        currentPassword: currentPassword,
                        newPassword: newPassword
                    };

                    var config = {
                        method: 'PATCH',
                        url: this.baseUrl + '/' + this.entityName + "/" + idIdentity + "/updatePassword",
                        data: data
                    };

                    this.$http(config).success(function (data, status, headers, config) {
                        deferred.resolve(null);
                    }).error(function (data, status, headers, config) {
                        if (status === 400) {
                            deferred.reject(data);
                        } else {
                            throw new Error("Fallo al insertar la entidad:" + status + "\n" + data);
                        }
                    });

                    return deferred.promise;
                };

                remoteDAO.enviarMailResetearContrasenya = function (email) {
                    var deferred = this.$q.defer();
                    var config = {
                        method: 'POST',
                        url: this.baseUrl + '/' + this.entityName + "/enviarMailResetearContrasenya/" + email
                    };
                    this.$http(config).success(function () {
                        deferred.resolve(null);
                    }).error(function (data, status) {
                        if (status === 400) {
                            deferred.reject(data);
                        } else {
                            throw new Error("Fallo al enviar la peticion de cambio de contaseña:" + status + "\n" + data);
                        }
                    });
                    return deferred.promise;
                };

                remoteDAO.resetearContrasenya = function (claveResetearContrasenya, nuevaContrasenya) {
                    var deferred = this.$q.defer();
                    var data = {
                        claveResetearContrasenya: claveResetearContrasenya,
                        nuevaContrasenya: nuevaContrasenya
                    };
                    var config = {
                        method: 'POST',
                        url: this.baseUrl + '/' + this.entityName + "/resetearContrasenya",
                        data: data
                    };
                    this.$http(config).success(function () {
                        deferred.resolve(null);
                    }).error(function (data, status) {
                        if (status === 400) {
                            deferred.reject(data);
                        } else {
                            throw new Error("Fallo al enviar la peticion de cambio de contraseña:" + status + "\n" + data);
                        }
                    });
                    return deferred.promise;
                };


            }]);

    }]);