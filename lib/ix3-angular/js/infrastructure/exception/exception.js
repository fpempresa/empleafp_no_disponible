(function () {

    angular.module("es.logongas.ix3").config(['$provide', function ($provide) {
            $provide.decorator("$exceptionHandler", ['$delegate', function ($delegate) {
                    return function (exception, cause) {
                        $delegate(exception, cause);
                        var arrStackTrace = printStackTrace({e: exception}); //Array con toda la pila de la traza del error
                        var message=exception.message;
                        alert("Uf, esto es embarazoso pero \n ha ocurrdo un error al procesar la petición     :-(\n\n\n"+message);
                    };
                }]);
        }]);

})();