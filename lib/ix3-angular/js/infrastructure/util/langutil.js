"use strict";

/**
 * 
 */
angular.module("es.logongas.ix3").factory("langUtil", [function () {

        return {
            getFunctionName: getFunctionName,
            splitValues:splitValues,
            setValue:setValue
        };

        /**
         * Obtiene el nombre de una función. Si la función es anonima reotrna ""
         * @param {Function} fn La función de la que se obtiene el nobmre
         * @returns {String} El nombre de la función
         */
        function getFunctionName(fn) {
            return fn.toString().substr(0, fn.toString().indexOf("(")).replace("function ", "");
        }
        
        
        /**
         * Hace un split pero si solo hay un elemento en el array y es "", retorna un array vacio.
         * Si no hay nada retorna un array sin elementos.
         * @param {String} values Es String con los distintos elementos
         * @param {String} separator El separador
         * @returns {Array[String]}
         */
        function splitValues(values, separator) {
            values = values || "";
            var arrValues = values.split(separator);
            if ((arrValues.length === 1) && (arrValues[0] === "")) {
                return [];
            } else {
                return arrValues;
            }
        }        
        
        /**
         * Asigna un valor a un objeto pero el valor de la propiedad puede tener subpropiedades anidadas.
         * @param {type} obj El objeto al que se le pone el valor
         * @param {type} key El nombre de la propiedad. Se prmiten cosas como "prop1.prop2.prop3"
         * @param {type} newValue El nuevo valor
         */
        function setValue(obj, key, newValue) {
            var keys = key.split('.');
            for (var i = 0; i < keys.length - 1; i++) {
                if (!obj[keys[i]]) {
                    obj[keys[i]] = {};
                }
                obj = obj[keys[i]];

            }
            obj[keys[keys.length - 1]] = newValue;
        }
        
        
    }]);


