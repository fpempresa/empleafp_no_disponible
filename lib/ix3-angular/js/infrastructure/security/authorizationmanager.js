(function (undefined) {
    "use strict";

    angular.module("es.logongas.ix3").run(['$rootScope', '$window', '$location', 'authorizationManager', 'ix3Configuration', function ($rootScope, $window, $location, authorizationManager, ix3Configuration) {


            $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                var status = authorizationManager.authorizeRoute(toState, toParams);

                if (status === 200) {
                    //Todo OK, así que no hacemos nada mas
                    //Ya que por defecto se verá la ruta
                } else if (status === 401) {
                    //Ir a la página de login
                    gotoKnownPage(ix3Configuration.pages.login);
                } else if (status === 403) {
                    //Ir a la página de prohibido
                    gotoKnownPage(ix3Configuration.pages.forbidden);
                } else {
                    throw new Error("Estado del error de seguridad desconocido:" + status);
                }
            });

            function gotoKnownPage(knownPage) {
                if (knownPage.absUrl && knownPage.url) {
                    throw new Error("No es posible definir a la vez los campos absUrl y url:" + knownPage.absUrl + "," + knownPage.url);
                }

                if (knownPage.absUrl) {
                    $window.location.href = knownPage.absUrl;
                } else if (knownPage.url) {
                    $location.url(knownPage.url);
                } else {
                    alert("No tiene permisos para acceder a la página");
                }
            }

        }]);


    AuthorizationManager.$inject = ['$rootScope', 'ix3Configuration', '$injector'];
    function AuthorizationManager($rootScope, ix3Configuration, $injector) {
        var acl = ix3Configuration.security.acl;
        var defaultStatus = ix3Configuration.security.defaultStatus;

        return {
            authorizeRoute: authorizeRoute
        };

        function authorizeRoute(state, params) {
            var path = state.url;

            if (isKnownPage(path, ix3Configuration.pages.login) || isKnownPage(path, ix3Configuration.pages.forbidden)) {
                //Siempre se permiten las página bien conocidas como las de login o prohibido
                return 200;
            }

            for (var i = 0; i < acl.length; i++) {
                var aceFn = acl[i];
                var locals = {
                    user: $rootScope.user,
                    state:state, 
                    params:params
                }
                var status = $injector.invoke(aceFn, undefined, locals);
                if (status) {
                    return status;
                }
            }

            return defaultStatus;

        }


        function isKnownPage(path, knownPage) {
            if (knownPage.absUrl && knownPage.url) {
                throw new Error("No es posible definir a la vez los campos absUrl y url:" + knownPage.absUrl + "," + knownPage.url);
            }

            if (knownPage.absUrl) {
                //Si es una url absoluta seguro que no coincide con una ruta
                return false;
            } else if (knownPage.url) {
                //Vemos si coindide la ruta
                if (path === knownPage.url) {
                    return true;
                } else {
                    return false;
                }
            } else {
                //No hay definida página
                return false;
            }
        }
    }

    angular.module('es.logongas.ix3').factory("authorizationManager", AuthorizationManager);


})();
