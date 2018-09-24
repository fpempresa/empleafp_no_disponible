angular.module("common").config(['serviceFactoryProvider', function (serviceFactoryProvider) {

        serviceFactoryProvider.addExtendService("Empresa", ['service', '$q','session', function (service, $q,session) {

                service.update = function (id, entity, expand) {
                    var deferred = $q.defer();

                    this.repository.update(id, entity, expand).then(function (empresa) {
                        if ((session.getUser().empresa) && (empresa.idEmpresa===session.getUser().empresa.idEmpresa)) {
                            session.getUser().empresa=empresa;
                        }
                        deferred.resolve(empresa);
                    }, function (businessMessages) {
                        deferred.reject(businessMessages);
                    });

                    return deferred.promise;
                };

                this.get = function (id, expand) {
                    var deferred = $q.defer();

                    this.repository.get(id, expand).then(function (empresa) {
                        if ((session.getUser().empresa) && (empresa.idEmpresa===session.getUser().empresa.idEmpresa)) {
                            session.getUser().empresa=empresa;
                        }
                        
                        deferred.resolve(empresa);
                    }, function (businessMessages) {
                        deferred.reject(businessMessages);
                    });

                    return deferred.promise;
                };

            }]);

    }]);