app.controller('MainController', ['$scope', 'goPage', 'ix3Configuration', '$http', function ($scope, goPage, ix3Configuration, $http) {
        $scope.login = function () {
            goPage.login();
        };
        $scope.chartData = [];
        $scope.createAccount = function () {
            goPage.createAccount();
        };

        $http({
            method: "GET",
            url: ix3Configuration.server.api + "/Estadisticas/publicas/"
        }).then(function (chartData) {
            $scope.chartData = chartData.data;
        }, function (businessMessages) {
            $scope.businessMessages = businessMessages;
        });
    }]);



