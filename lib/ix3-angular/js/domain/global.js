"use strict";

angular.module('es.logongas.ix3').config(['richDomainProvider', function (richDomain) {



        richDomain.addGlobalTransformer(function () {
            return function (object, propertyPath) {
                //Para transformar los Strign en fechas
                for (var key in object) {
                    if (!object.hasOwnProperty(key)) {
                        continue;
                    }
                    var value = object[key];
                    if ((typeof value === "string") && (value.length === 24) && (value.charAt(10) === "T") && (value.charAt(23) === "Z")) {
                        var date = moment(value, "YYYY-MM-DDTHH:mm:ss.SSSZ", true);
                        if (date.isValid()) {
                            object[key] = date.toDate();
                        }
                    }
                }

            };

        });


        richDomain.addGlobalTransformer(function () {
            function toStringGlobal() {
                return this["$toString"];
            }

            return function (object, propertyPath) {
                //Añadir el método toString() para que use la propiedad "$toString", pero solo si existe
                if (object.hasOwnProperty('$toString')) {
                    //Definimos nuestra propia función "toString"
                    object['toString'] = toStringGlobal;
                }
            };
        });

    }]);