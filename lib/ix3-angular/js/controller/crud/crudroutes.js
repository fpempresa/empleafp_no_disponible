"use strict";

(function () {

    CRUDRoutes.$inject = ['$stateProvider', 'ix3ConfigurationProvider'];
    function CRUDRoutes($stateProvider, ix3ConfigurationProvider) {

        this.parentState = ix3ConfigurationProvider.crud.parentState;
        this.parentPathViews = ix3ConfigurationProvider.crud.parentPathViews;

        this.addAllRoutes = function (config) {
            this.addSearchRoute(config);
            this.addNewRoute(config);
            this.addEditRoute(config);
            this.addDeleteRoute(config);
            this.addViewRoute(config);
        };

        function getRouteConfig(crudName,entity,parentPathViews,parentState) {
            
            var parts=(crudName || entity).split(".");
            
            if (parentState) {
                parentState=parentState+".";
            }            
            
            var arrStateBase=[];

            
            var arrUrlBasePath=[];
           
            var arrTemplateBasePath=[];
            if (parentPathViews) {
                arrTemplateBasePath.push(parentPathViews);
            } 
            
            var arrControllerPrefix=[];
            
            for(var i=0;i<parts.length;i++) {
               arrStateBase.push(parts[i].toLowerCase());
               arrUrlBasePath.push(parts[i].toLowerCase());
               arrTemplateBasePath.push(parts[i].toLowerCase());
               arrControllerPrefix.push(parts[i].charAt(0).toUpperCase() + parts[i].slice(1));
            }            

            
            
            return {
                stateBase:parentState + arrStateBase.join("_"),
                urlBasePath:arrUrlBasePath.join("/"),
                templateBasePath:arrTemplateBasePath.join("/"),
                controllerPrefix:arrControllerPrefix.join("")
            }
        }

        this.addSearchRoute = function (config) {
            if (!config) {
                throw Error("El parámetro 'config' no puede estar vacio");
            }            
            if (!config.entity) {
                throw Error("El parámetro 'config.entity' no puede estar vacio");
            }            


            var routeConfig=getRouteConfig(config.crudName,config.entity,this.parentPathViews,this.parentState);

            $stateProvider.state(routeConfig.stateBase + "_search_parent", {
                url: '/' + routeConfig.urlBasePath + '/search/:parentProperty/:parentId',
                templateUrl: routeConfig.templateBasePath + '/search.html',
                controller: routeConfig.controllerPrefix + 'SearchController',
                resolve: this.getResolve(config.entity, config.expand)
            });

            $stateProvider.state(routeConfig.stateBase + "_search", {
                url: '/' + routeConfig.urlBasePath + '/search',
                templateUrl: routeConfig.templateBasePath + '/search.html',
                controller: routeConfig.controllerPrefix + 'SearchController',
                resolve: this.getResolve(config.entity, config.expand)
            });

        };


        this.addNewRoute = function (config) {
            if (!config) {
                throw Error("El parámetro 'config' no puede estar vacio");
            }            
            if (!config.entity) {
                throw Error("El parámetro 'config.entity' no puede estar vacio");
            }            


            var routeConfig=getRouteConfig(config.crudName,config.entity,this.parentPathViews,this.parentState);

            $stateProvider.state(routeConfig.stateBase + "_new_parent", {
                url: '/' + routeConfig.urlBasePath + '/new/:parentProperty/:parentId',
                templateUrl: routeConfig.templateBasePath + '/detail.html',
                controller: routeConfig.controllerPrefix + 'NewEditController',
                resolve: this.getResolve(config.entity, config.expand, "NEW")
            });

            $stateProvider.state(routeConfig.stateBase + "_new_", {
                url: '/' + routeConfig.urlBasePath + '/new',
                templateUrl: routeConfig.templateBasePath + '/detail.html',
                controller: routeConfig.controllerPrefix + 'NewEditController',
                resolve: this.getResolve(config.entity, config.expand, "NEW")
            });

        };
        
        
        this.addViewRoute = function (config) {
            if (!config) {
                throw Error("El parámetro 'config' no puede estar vacio");
            }            
            if (!config.entity) {
                throw Error("El parámetro 'config.entity' no puede estar vacio");
            }             
            
            
            var routeConfig=getRouteConfig(config.crudName,config.entity,this.parentPathViews,this.parentState);

            $stateProvider.state(routeConfig.stateBase + "_view_parent", {
                url: '/' + routeConfig.urlBasePath + '/view/:id/:parentProperty/:parentId',
                templateUrl: routeConfig.templateBasePath + '/detail.html',
                controller: routeConfig.controllerPrefix + 'ViewController',
                resolve: this.getResolve(config.entity, config.expand, "VIEW")
            });

            $stateProvider.state(routeConfig.stateBase + "_view_", {
                url: '/' + routeConfig.urlBasePath + '/view/:id',
                templateUrl: routeConfig.templateBasePath + '/detail.html',
                controller: routeConfig.controllerPrefix + 'ViewController',
                resolve: this.getResolve(config.entity, config.expand, "VIEW")
            });
        };
        
        
        this.addEditRoute = function (config) {
            if (!config) {
                throw Error("El parámetro 'config' no puede estar vacio");
            }            
            if (!config.entity) {
                throw Error("El parámetro 'config.entity' no puede estar vacio");
            }             


            var routeConfig=getRouteConfig(config.crudName,config.entity,this.parentPathViews,this.parentState);

            $stateProvider.state(routeConfig.stateBase + "_edit_parent", {
                url: '/' + routeConfig.urlBasePath + '/edit/:id/:parentProperty/:parentId',
                templateUrl: routeConfig.templateBasePath + '/detail.html',
                controller: routeConfig.controllerPrefix + 'NewEditController',
                resolve: this.getResolve(config.entity, config.expand, "EDIT")
            });

            $stateProvider.state(routeConfig.stateBase + "_edit_", {
                url: '/' + routeConfig.urlBasePath + '/edit/:id',
                templateUrl: routeConfig.templateBasePath + '/detail.html',
                controller: routeConfig.controllerPrefix + 'NewEditController',
                resolve: this.getResolve(config.entity, config.expand, "EDIT")
            });
        };
        
        
        this.addDeleteRoute = function (config) {
            if (!config) {
                throw Error("El parámetro 'config' no puede estar vacio");
            }            
            if (!config.entity) {
                throw Error("El parámetro 'config.entity' no puede estar vacio");
            } 


            var routeConfig=getRouteConfig(config.crudName,config.entity,this.parentPathViews,this.parentState);

            $stateProvider.state(routeConfig.stateBase + "_delete_parent", {
                url: '/' + routeConfig.urlBasePath + '/delete/:id/:parentProperty/:parentId',
                templateUrl: routeConfig.templateBasePath + '/detail.html',
                controller: routeConfig.controllerPrefix + 'DeleteController',
                resolve: this.getResolve(config.entity, config.expand, "DELETE")
            });

            $stateProvider.state(routeConfig.stateBase + "_delete_", {
                url: '/' + routeConfig.urlBasePath + '/delete/:id',
                templateUrl: routeConfig.templateBasePath + '/detail.html',
                controller: routeConfig.controllerPrefix + 'DeleteController',
                resolve: this.getResolve(config.entity, config.expand, "DELETE")
            });
        };
        
        
        this.getResolve = function (entity, expand, controllerAction) {
            var resolve;
            if (controllerAction) {
                resolve = {
                    controllerParams: ['$stateParams', function ($stateParams) {
                            return {
                                entity: entity,
                                controllerAction: controllerAction,
                                id: $stateParams.id,
                                parentProperty: $stateParams.parentProperty,
                                parentId: $stateParams.parentId,
                                expand: expand
                            };
                        }],
                    schema: ['schemaEntities', function (schemaEntities) {
                            return schemaEntities.load(entity, expand);
                        }]
                };
            } else {
                //El resolve del "search"
                resolve = {
                    controllerParams: ['$stateParams', function ($stateParams) {
                            return {
                                entity: entity,
                                parentProperty: $stateParams.parentProperty,
                                parentId: $stateParams.parentId,
                                expand: expand
                            };
                        }],
                    schema: ['schemaEntities', function (schemaEntities) {
                            return schemaEntities.load(entity, expand);
                        }]
                };
            }
            return resolve;
        };        
        
        
        this.$get = function () {
            //Realmente no queremos nada aqui pero angular nos obliga.
            return {};
        };
        
    }

    angular.module('es.logongas.ix3').provider("crudRoutes", CRUDRoutes);


})();