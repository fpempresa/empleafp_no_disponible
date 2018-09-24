(function (undefined) {
    "use strict";

    BuscarEmpresaController.$inject = ['$scope', 'genericControllerCrudList', 'currentDialog', 'controllerParams'];
    function BuscarEmpresaController($scope, genericControllerCrudList, currentDialog, controllerParams) {
        genericControllerCrudList.extendScope($scope, controllerParams);
        $scope.page.pageSize = 10;
        angular.extend($scope.filters, currentDialog.params.filters);

        $scope.orderby=[
            {fieldName:"nombreComercial",orderDirection:"ASC"}
        ];

        currentDialog.open({
            width: 600,
            height: 800,
            title: "Buscar empresa"
        });



        $scope.buttonCancel = function () {
            currentDialog.closeCancel();
        };

        $scope.buttonSeleccionar = function (empresa) {
            currentDialog.closeOK(empresa);
        };
        
        if (currentDialog.params.initialSearch) {
            $scope.search();
        }

    }

    angular.module("common").controller("BuscarEmpresaController", BuscarEmpresaController);


    angular.module("common").config(['dialogProvider', 'getContextPath', 'crudRoutesProvider', function (dialogProvider, getContextPath, crudRoutesProvider) {
            
        dialogProvider.when('buscarEmpresas', {
            templateUrl: getContextPath() + "/common/presentation/view/empresa/buscar-empresas.html",
            controller: 'BuscarEmpresaController',
            resolve: crudRoutesProvider.getResolve('Empresa', 'direccion.municipio,direccion.municipio.provincia')
        });
                    
    }]);




})();