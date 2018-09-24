"use strict";

angular.module('es.logongas.ix3').directive('ix3OrderFieldNames', ['langUtil',function (langUtil) {
        return {
            restrict: 'A',
            scope: false,
            link: function ($scope, element, attributes) {
                var fieldNames=langUtil.splitValues(attributes.ix3OrderFieldNames,',');
                
                if (fieldNames.length===0) {
                    throw new Error("Es requerido el nombre de al menos una columna por la que ordenar");
                }
                
                $(element).css('cursor','pointer');
                
                var index=getIndex($scope.orderby,fieldNames[0]);
                if (index!==-1) {
                    $(element).text(getTextWithTriangle($(element).text(),$scope.orderby[index].orderDirection));
                }
                
                $(element).on("click", function () {
                    var newOrder;
                    for (var i = fieldNames.length-1; i >=0 ; i--) {
                        var fieldName=fieldNames[i];
                        var index=getIndex($scope.orderby,fieldName);

                        if (index===-1) {
                            newOrder={fieldName: fieldName, orderDirection: 'ASC'};
                            $scope.orderby.unshift(newOrder);
                        } else  {
                            newOrder=$scope.orderby[index];
                            newOrder.orderDirection=nextOrderDirection(newOrder.orderDirection);
                            $scope.orderby.splice(index, 1);
                            if (newOrder.orderDirection!=="") {
                                $scope.orderby.unshift(newOrder);
                            }
                        }
                    }
                    
                    $(element).text(getTextWithTriangle($(element).text(),newOrder.orderDirection));
                    
                    $scope.buttonSearch();
                    
                });
            }
        };

        function getTextWithTriangle(text,orderDirection) {
            var triangleUp="\u25B2";
            var triangleDown="\u25BC";
            
            function getTriangle(orderDirection) {
                if (orderDirection === 'ASC') {
                    return triangleUp;
                } else if (orderDirection === 'DESC') {
                    return triangleDown;
                } else if (orderDirection === '' || typeof (orderDirection) === "undefined") {
                    return "";                    
                } else {
                    throw new Error("La dirección debe valer ASC o DESC");
                }
            }
            
            
            if (text) {
                if (text.slice(-1)===triangleUp || text.slice(-1)===triangleDown) { 
                    return text.substr(0,text.length-1)+getTriangle(orderDirection);
                } else {
                    return text+getTriangle(orderDirection);
                }
            } else {
                return getTriangle(orderDirection);
            } 
        }


        function nextOrderDirection(orderDirection) {
            if (orderDirection === 'ASC') {
                return "DESC";
            } else if (orderDirection === 'DESC') {
                return "";
            } else if (orderDirection === '' || typeof (orderDirection) === "undefined") {
                return "ASC";
            } else {
                throw new Error("La dirección debe valer ASC o DESC");
            }
        }

        function getIndex(orderby, fieldName) {
            var index = -1;
            for (var i = 0; i < orderby.length; i++) {
                if (orderby[i].fieldName === fieldName) {
                    index = i;
                    break;
                }
            }

            return index;
        }

    }]);

