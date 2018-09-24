"use strict";

angular.module('es.logongas.ix3').directive('ix3Pagination', function() {
    return {
        restrict: 'E',
        template: '<div class="pagination" style="margin-top:0px" ng-show="page.totalPages > 0"> ' +
                '  <ul class="pagination" style="margin-top:0px"> ' +
                '    <li ng-class="{ disabled:page.pageNumber == 0 }" ><a href="javascript:void(0)" ng-click="page.pageNumber = 0">&laquo;</a></li> ' +
                '    <li ng-class="{ active:$parent.page.pageNumber === pageNumber,disable:page.pageNumber < 0 }" ng-switch="pageNumber" ng-repeat="pageNumber in rangePages(page.pageNumber, page.totalPages)" >' +
                '      <span ng-switch-when="-100">...</span> ' +
                '      <span ng-switch-when="-200">...</span> ' +
                '      <a ng-switch-default href="javascript:void(0)" ng-click="page.pageNumber = pageNumber">{{pageNumber+1}}</a>' +
                '    </li> ' +
                '    <li ng-class="{ disabled:page.pageNumber == page.totalPages - 1 }" ><a href="javascript:void(0)" ng-click="page.pageNumber = page.totalPages - 1">&raquo;</a></li> ' +
                '  </ul> ' +
                '</div>',
        scope: {
            
        },
        link: function($scope, element, attributes) {
            var pageName=attributes.page || "page";
            $scope.page=$scope.$parent[pageName];
            
            $scope.rangePages = function(pageNumber, totalPages) {
                if (!totalPages) {
                    return [];
                }
                var numeroPaginasVisibles = 5;
                var left = Math.ceil((numeroPaginasVisibles - 1) / 2);
                var rigth = numeroPaginasVisibles - 1 - left;

                var minPaginaVisible = pageNumber - left;
                var maxPaginaVisible = pageNumber + rigth;

                if ((minPaginaVisible >= 0) && (maxPaginaVisible < totalPages)) {
                    //Todo OK
                } else if ((minPaginaVisible < 0) && (maxPaginaVisible < totalPages)) {
                    //Sobran por la izquierda, se añaden a la derecha
                    var sobrantes = Math.abs(minPaginaVisible);
                    minPaginaVisible = 0;
                    maxPaginaVisible = maxPaginaVisible + sobrantes;

                } else if ((minPaginaVisible >= 0) && (maxPaginaVisible >= totalPages)) {
                    //Sobran por la derecha se añaden a la izquierda
                    var sobrantes = (maxPaginaVisible - totalPages) + 1;
                    minPaginaVisible = minPaginaVisible - sobrantes;
                    maxPaginaVisible = totalPages - 1;
                } else if ((minPaginaVisible < 0) && (maxPaginaVisible >= totalPages)) {
                    //Sobran por los 2 lados
                    minPaginaVisible = 0;
                    maxPaginaVisible = totalPages - 1;
                } else {
                    throw Error("Error de logica:" + minPaginaVisible + " " + maxPaginaVisible);
                }


                if (minPaginaVisible < 0) {
                    minPaginaVisible = 0;
                }
                if (maxPaginaVisible >= totalPages) {
                    maxPaginaVisible = totalPages - 1;
                }

                var visiblePages = new Array();
                for (var i = minPaginaVisible; i <= maxPaginaVisible; i++) {
                    visiblePages.push(i);
                }

                if (minPaginaVisible===0) { 
                    visiblePages.push(maxPaginaVisible+1);
                    visiblePages.push(maxPaginaVisible+2);
                    maxPaginaVisible=maxPaginaVisible+2;
                } else if (minPaginaVisible===1) {
                    visiblePages.unshift(0);
                    visiblePages.push(maxPaginaVisible+1);
                    minPaginaVisible=0;
                    maxPaginaVisible=maxPaginaVisible+1;
                } else if (minPaginaVisible===2) { 
                    visiblePages.unshift(1);
                    visiblePages.unshift(0);
                    minPaginaVisible=0;
                } 


                if (maxPaginaVisible===totalPages-1) { 
                    visiblePages.unshift(minPaginaVisible-1);
                    visiblePages.unshift(minPaginaVisible-2);
                    minPaginaVisible=minPaginaVisible-2;
                } else if (maxPaginaVisible===totalPages-2) {
                    visiblePages.unshift(minPaginaVisible-1);
                    visiblePages.push(maxPaginaVisible+1);
                    minPaginaVisible=minPaginaVisible-1;
                    maxPaginaVisible=maxPaginaVisible+1;
                } else if (maxPaginaVisible===totalPages-3) { 
                    visiblePages.push(totalPages-2);
                    visiblePages.push(totalPages-1);
                    maxPaginaVisible=totalPages-1;
                } 


                if (minPaginaVisible>=3) {
                    visiblePages.unshift(-100);
                    visiblePages.unshift(1);
                    visiblePages.unshift(0);
                } else if (minPaginaVisible===2) {
                    visiblePages.unshift(1);
                    visiblePages.unshift(0);
                } else if (minPaginaVisible===1) {
                    visiblePages.unshift(0);
                }
                
                if (maxPaginaVisible<totalPages-3) {
                    visiblePages.push(-200);
                    visiblePages.push(totalPages - 2);
                    visiblePages.push(totalPages - 1);
                } else if (maxPaginaVisible===totalPages-3) {
                    visiblePages.push(totalPages - 2);
                    visiblePages.push(totalPages - 1);
                } else if (maxPaginaVisible<totalPages-2) {
                    visiblePages.push(totalPages - 1);
                }           

                for(var i=visiblePages.length-1;i>=0;i--) {
                    if ((visiblePages[i]<0) && (visiblePages[i]>-100)) {
                        visiblePages.splice(i,1);
                    }
                    if (visiblePages[i]>=totalPages)  {
                        visiblePages.splice(i,1);
                    }                    
                }

                return visiblePages;
            };
        }
    };
});
