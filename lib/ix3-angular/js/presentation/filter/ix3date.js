(function () {
    "use strict";



    angular.module('es.logongas.ix3').filter("ix3Date", ['$filter','dateFormat', function ($filter, dateFormat) {

            return function (date) {
                if (!date) {
                    return "";
                } else {
                    return $filter('date')(date, dateFormat.getDefaultDateFormat());
                }
            };
        }]);

})();