"use strict";

angular.module("common").directive('fpeSimpleBarChart', [function () {
        return {
            restrict: 'A',
            scope: {
                title: "@",
                subtitle: "@",
                titleY: "@",
                titleX: "@",
                serie: "="
            },
            link: function ($scope, element, attributes) {

                $scope.$watch("serie", function (newSerie,oldSerie) {
                    
                    if (newSerie===oldSerie) {
                        return;
                    }
                    
                    if (element.highcharts()) {
                        element.highcharts().destroy();
                    }
                    if (newSerie === null)  {
                        return;
                    }

                    var labels = [];
                    var data = [];
                    for (var i = 0; i < $scope.serie.length; i++) {
                        labels.push($scope.serie[i].$toString);
                        data.push($scope.serie[i].valor);
                    }

                    element.highcharts({
                        chart: {
                            type: 'column'
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: $scope.title
                        },
                        subtitle: {
                            text: $scope.subtitle
                        },
                        xAxis: {
                            categories: labels
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: $scope.titleY
                            }
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0,
                                dataLabels: {
                                    enabled: true,
                                    color: "#000000",
                                    style: {
                                        fontWeight: 'bold'
                                    },
                                    formatter: function () {
                                        return this.y;
                                    }
                                }
                            }
                        },
                        series: [{
                                name: $scope.titleX,
                                data: data

                            }],
                        exporting: {
                            enabled: false
                        }
                    });

                })


            }
        };
    }]);

 