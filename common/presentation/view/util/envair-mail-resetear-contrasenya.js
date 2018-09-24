(function (undefined) {
    "use strict";

    EnviarMailResetearContrasenyaDialogController.$inject = ['$scope', 'serviceFactory', 'formValidator', 'currentDialog'];
    function EnviarMailResetearContrasenyaDialogController($scope, serviceFactory, formValidator, currentDialog) {
        $scope.businessMessages = [];

        currentDialog.open({
            width: 550,
            height: 'auto',
            title: "Solicitar nueva contraseña"
        });

        $scope.buttonCancel = function () {
            currentDialog.closeCancel();
        };

        $scope.buttonOK = function () {
            var usuarioService = serviceFactory.getService("Usuario");
            $scope.businessMessages = formValidator.validate($scope.mainForm, $scope.$validators);
            if ($scope.businessMessages.length === 0) {
                usuarioService.enviarMailResetearContrasenya($scope.userEmail).then(function () {
                    alert("Su su petición se ha enviado correctamente. Pronto recibirá un correo con la información para proceder a resetear su contraseña.");
                    currentDialog.closeOK();
                }, function (businessMessages) {
                    $scope.businessMessages = businessMessages;
                });
            }
        };

    }

    angular.module("common").controller("EnviarMailResetearContrasenyaDialogController", EnviarMailResetearContrasenyaDialogController);

    angular.module("common").config(['dialogProvider', 'getContextPath', function (dialogProvider, getContextPath) {

            dialogProvider.when('enviarMailResetearContrasenya', {
                templateUrl: getContextPath() + "/common/presentation/view/util/envair-mail-resetear-contrasenya.html",
                controller: 'EnviarMailResetearContrasenyaDialogController'
            });

        }]);

})();