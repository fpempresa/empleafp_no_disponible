"use strict";

angular.module("common").directive('fpeFileUpload', ['ix3Configuration', function (ix3Configuration) {
        return {
            restrict: 'E',
            scope: {
                text: "@",
                url: "@",
                success: "&",
                fail: "&"
            },
            templateUrl: getContextPath() + '/common/presentation/directive/fpe-file-upload.html',
            link: function ($scope, element, attributes) {
                var mainProgressElement = $('.progress', element);

                mainProgressElement.css({visibility: "hidden"});
                $(element).fileupload({
                    url: $scope.url,
                    method: "POST",
                    progressall: function (e, data) {
                        mainProgressElement.css({visibility: "visible"});
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('.progress-bar', element).css('width', progress + '%');
                    },
                    always: function () {
                        mainProgressElement.css({visibility: "hidden"});
                        $('.progress-bar', element).css('width', 0 + '%');
                    },
                    done: function (e, data) {
                        $scope.$evalAsync($scope.success);
                    },
                    fail: function (e, data) {
                        $scope.$evalAsync($scope.fail);
                        $scope.fail({data: data});
                    }
                });
            }
        };
    }]);



