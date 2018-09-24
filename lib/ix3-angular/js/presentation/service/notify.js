"use strict";
/**
 * Servicio para notificar mensajes de forma asincrona al usuario
 */
angular.module("es.logongas.ix3").service("notify", [function() {
        return {
            info: function(title, message) {
                new PNotify({
                    title: title,
                    text: message,
                    type: 'info'
                });
            },
            warning: function(title, message) {
                new PNotify({
                    title: title,
                    text: message
                });
            },
            error: function(title, message) {
                new PNotify({
                    title: title,
                    text: message,
                    type: 'error'
                });
            }
        };
    }]);