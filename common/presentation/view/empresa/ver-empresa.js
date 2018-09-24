(function (undefined) {
    "use strict";

    VerEmpresaController.$inject = ['$scope', 'genericControllerCrudDetail', 'currentDialog', 'controllerParams'];
    function VerEmpresaController($scope, genericControllerCrudDetail, currentDialog, controllerParams) {
        controllerParams.id = currentDialog.params.id;
        genericControllerCrudDetail.extendScope($scope, controllerParams);


        currentDialog.open({
            width: 850,
            height: 700,
            title: "Ver empresa"
        });

        $scope.finishOK = function () {
            currentDialog.closeCancel();
        };

    }

    angular.module("common").controller("VerEmpresaController", VerEmpresaController);


    angular.module("common").config(['dialogProvider', 'getContextPath', 'crudRoutesProvider', function (dialogProvider, getContextPath, crudRoutesProvider) {

            dialogProvider.when('verEmpresa', {
                templateUrl: getContextPath() + "/common/presentation/view/empresa/ver-empresa.html",
                controller: 'VerEmpresaController',
                resolve: crudRoutesProvider.getResolve('Empresa', 'direccion.municipio,direccion.municipio.provincia', 'VIEW')
            });

        }]);




})();