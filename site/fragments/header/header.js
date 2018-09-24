app.controller("HeaderController", ['$scope', 'goPage', function ($scope, goPage) {
        $scope.homeUsuario = function () {
            goPage.homeUsuario();
        }
    }]);
