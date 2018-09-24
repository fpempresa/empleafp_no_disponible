(function () {
    "use strict";

    DateFormat.$inject=['$locale','ix3Configuration']
    function DateFormat($locale,ix3Configuration) {
        
        var _defaultDateFormat=ix3Configuration.format.date.default;
        var _$locale=$locale;
        
        return {
            getAngularFormatFromPredefined:getAngularFormatFromPredefined,
            getMomentFormatFromAngularJSFormat:getMomentFormatFromAngularJSFormat,
            getJQueryDatepickerFormatFromAngularJSFormat:getJQueryDatepickerFormatFromAngularJSFormat,
            getDefaultDateFormat:getDefaultDateFormat
        }

        /**
         * Obtiene el formato de fecha de Angular correspondiente a un "localizable format"
         * @param {String} angularjsFormat Un formato de fecha de AngularJS
         * @returns {String} Si es un "localizable format" retorna es Spring correspondiente , sino retorna el mismo String
         */
        function getAngularFormatFromPredefined(angularjsFormat) {
            var newFormat;
            if (angularjsFormat === "fullDate") {
                newFormat = _$locale.DATETIME_FORMATS.fullDate;
            } else if (angularjsFormat === "longDate") {
                newFormat = _$locale.DATETIME_FORMATS.longDate;
            } else if (angularjsFormat === "medium") {
                newFormat = _$locale.DATETIME_FORMATS.medium;
            } else if (angularjsFormat === "mediumDate") {
                newFormat = _$locale.DATETIME_FORMATS.mediumDate;
            } else if (angularjsFormat === "mediumTime") {
                newFormat = _$locale.DATETIME_FORMATS.mediumTime;
            } else if (angularjsFormat === "short") {
                newFormat = _$locale.DATETIME_FORMATS.short;
            } else if (angularjsFormat === "shortDate") {
                newFormat = _$locale.DATETIME_FORMATS.shortDate;
            } else if (angularjsFormat === "shortTime") {
                newFormat = _$locale.DATETIME_FORMATS.shortTime;
            } else {
                newFormat = angularjsFormat;
            }

            return newFormat;
        };

        /**
         * Tranforma un formato de fecha de AngularJS en un formato de fecha de moment.js
         * @param {String} angularjsFormat El formato de fecha de AngularJS que NO sea un "localizable format"
         * @returns {String} Formato de fecha de moment.js
         */
        function getMomentFormatFromAngularJSFormat(angularjsFormat) {
            var format = angularjsFormat;
            var inLiteral = false;
            var newFormat = "";
            var c;
            var newc;
            var prevY;
            var nextY;
            for (var i = 0; i < format.length; i++) {
                c = format.charAt(i);
                if ((c === "'") && (inLiteral === false)) {
                    newc = "[";
                    inLiteral = true;
                } else if ((c === "'") && (inLiteral === true)) {
                    newc = "]";
                    inLiteral = false;
                } else if (inLiteral === true) {
                    newc = c;
                } else if (c === "d") {
                    newc = "D";
                } else if (c === "a") {
                    newc = "A";
                } else if (c === "y") {
                    if (i === 0) {
                        prevY = false;
                    } else {
                        prevY = (format.charAt(i - 1) === "y");
                    }

                    if (i === (format.length - 1)) {
                        nextY = false;
                    } else {
                        nextY = (format.charAt(i + 1) === "y");
                    }

                    if ((prevY === false) && (nextY === false)) {
                        newc = "YYYY";
                    } else {
                        newc = "Y";
                    }


                } else if (c === "E") {
                    newc = "d";
                } else if (c === "Z") {
                    newc = "ZZ";
                } else {
                    newc = c;
                }

                newFormat = newFormat + newc;
            }

            return newFormat.replace(/sss/g, "SSS");
        };

        /**
         * Tranforma un formato de fecha de AngularJS en un formato de fecha de jQuery UI Datepicker
         * @param {String} angularjsFormat El formato de fecha de AngularJS que NO sea un "localizable format"
         * @returns {String} Formato de fecha de jQuery UI Datepicker
         */
        function getJQueryDatepickerFormatFromAngularJSFormat(angularjsFormat) {
            var newFormat = angularjsFormat;
            newFormat = newFormat.replace(/([^M]|^)(M)([^M]|$)/g, function (match, p1, p2, p3, offset, string) {
                return p1 + "m" + p3;
            });
            newFormat = newFormat.replace(/([^M]|^)(MM)([^M]|$)/g, function (match, p1, p2, p3, offset, string) {
                return p1 + "mm" + p3;
            });
            newFormat = newFormat.replace(/([^M]|^)(MMM)([^M]|$)/g, function (match, p1, p2, p3, offset, string) {
                return p1 + "M" + p3;
            });
            newFormat = newFormat.replace(/([^M]|^)(MMMM)([^M]|$)/g, function (match, p1, p2, p3, offset, string) {
                return p1 + "MM" + p3;
            });
            newFormat = newFormat.replace(/([^y]|^)(yy)([^y]|$)/g, function (match, p1, p2, p3, offset, string) {
                return p1 + "@#@#" + p3;
            });
            newFormat = newFormat.replace(/([^y]|^)(yyyy)([^y]|$)/g, function (match, p1, p2, p3, offset, string) {
                return p1 + "yy" + p3;
            });
            newFormat = newFormat.replace(/([^y]|^)(y)([^y]|$)/g, function (match, p1, p2, p3, offset, string) {
                return p1 + "yy" + p3;
            });
            newFormat = newFormat.replace(/@#@#/g, "y");

            return newFormat;

        };

        function getDefaultDateFormat() {
            return _defaultDateFormat;
        };

    }
    
    angular.module("es.logongas.ix3").factory("dateFormat",DateFormat);

})();




