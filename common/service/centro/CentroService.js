angular.module("common").config(['serviceFactoryProvider', function (serviceFactoryProvider) {

        serviceFactoryProvider.addExtendService("Centro", ['service', '$q','session', function (service, $q,session) {

                service.update = function (id, entity, expand) {
                    var deferred = $q.defer();

                    this.repository.update(id, entity, expand).then(function (centro) {
                        if ((session.getUser().centro) && (centro.idCentro===session.getUser().centro.idCentro)) {
                            session.getUser().centro=centro;
                        }
                        deferred.resolve(centro);
                    }, function (businessMessages) {
                        deferred.reject(businessMessages);
                    });

                    return deferred.promise;
                };

                this.get = function (id, expand) {
                    var deferred = $q.defer();

                    this.repository.get(id, expand).then(function (centro) {
                        if ((session.getUser().centro) && (centro.idCentro===session.getUser().centro.idCentro)) {
                            session.getUser().centro=centro;
                        }
                        
                        deferred.resolve(centro);
                    }, function (businessMessages) {
                        deferred.reject(businessMessages);
                    });

                    return deferred.promise;
                };

            }]);

    }]);