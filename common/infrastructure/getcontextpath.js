angular.module("common").constant("getContextPath", getContextPath);

angular.module("common").run(['$rootScope', 'getContextPath', function ($rootScope, getContextPath) {
        $rootScope.getContextPath = getContextPath;
}]);