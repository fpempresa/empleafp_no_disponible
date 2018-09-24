"use strict";

angular.module('es.logongas.ix3.configuration').constant("ix3UserConfiguration",{
    bootstrap: {
        version:3
    },
    server: {
        api:getContextPath() + "/api/site"
    },
    format: {
        date: {
            default:"dd/MM/yyyy"
        }
    },
    pages: {
        login:{
            url:"/login"
        }
    },
    security:{
        defaultStatus:200
    },
    session: {
        url: getContextPath() + "/api",        
        expand:"empresa,centro,titulado.direccion.municipio.provincia"
    }
});
