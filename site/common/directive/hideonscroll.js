"user strict";

(function () {

    app.directive("fpeHideOnScroll", ['$window', '$rootScope', '$location', function ($window, $rootScope, $location) {
            var directiveDefinitionObject = {
                restrict:"A",
                compile: function (tElement, tAttrs) {
                    return {
                        pre: function (scope, iElement, iAttrs, controller, transcludeFn) {
                        },
                        post: function (scope, iElement, iAttrs, controller, transcludeFn) {
                            var defaultConfig = {
                                cssClassName: "top-nav-collapse",
                                threshold: 80,
                                applyInPath: "/"
                            }

                            var config = scope.$eval(iAttrs.fpeHideOnScroll) || defaultConfig;

                            showHide(iElement, config, $location.path());

                            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                                showHide(iElement, config, toState.url);
                            });

                            $($window).scroll(function () {
                                showHide(iElement, config, $location.path());
                            });
                        }
                    };
                }
            };

            return directiveDefinitionObject;
        }]);

    function showHide(iElement, config, currentPath) {
        if (currentPath === config.applyInPath) {
            var offset = iElement.offset();
            if (offset.top > config.threshold) {
                iElement.addClass(config.cssClassName);
            } else {
                iElement.removeClass(config.cssClassName);
            }
        } else {
            iElement.addClass(config.cssClassName);
        }
    }

})();