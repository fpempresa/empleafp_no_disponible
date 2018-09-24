(function (undefined) {
    "use strict";
    
    SchemaEntities.$inject = ["repositoryFactory", "$q","langUtil"];
    function SchemaEntities(repositoryFactory, $q,langUtil) {
        //Aqui guardamos cada uno los metadatos de cada entidad
        var schemasStorage = new SchemasStorage(langUtil);

        var schema = {
            load: load,
            getSchema: getSchema,
            getSchemaProperty: getSchemaProperty
        };

        return schema;


        function load(entityName, expands) {
            var deferred = $q.defer();

            var arrExpands = langUtil.splitValues(expands, ",");

            var exists = schemasStorage.existsSchema(entityName, arrExpands);
            if (exists === true) {
                deferred.resolve(schemasStorage.getSchema(entityName));
            } else {
                var repository = repositoryFactory.getRepository(entityName);
                repository.schema(expands).then(function (newSchema) {
                    //Ahora hay que fusionar lo que acaba de llegar con lo que hay
                    if (schemasStorage.getSchema(entityName) === null) {
                        //No hay nada así que añadimos todo lo que acabamos de cargar
                        schemasStorage.addSchema(entityName, newSchema);
                    } else {
                        //Ahora hay que añadir parte por parte de lo que falta.
                        var currentSchema = schemasStorage.getSchema(entityName);

                        for (var i = 0; i < arrExpands.length; i++) {
                            var expand = arrExpands[i];
                            //Vamos a comprobar el expand que falta
                            if (schemasStorage.existsSchema(entityName, expand) === false) {
                                //La variable existExpand es la parte que si que existe
                                var existExpand = schemasStorage.getBestExistsProperty(entityName, expand);
                                var nextProperty;
                                if (existExpand === "") {
                                    nextProperty = expand;
                                } else {
                                    nextProperty = expand.substring(existExpand.length + 1);
                                }
                                nextProperty = nextProperty.split(".")[0];
                                currentSchema.getSchemaProperty(existExpand).properties[nextProperty] = newSchema.getSchemaProperty(existExpand).properties[nextProperty];
                            }
                        }


                    }


                    deferred.resolve(schemasStorage.getSchema(entityName));
                }, function (data) {
                    deferred.reject(data);
                });
            }

            return deferred.promise;
        }


        function getSchema(entityName) {
            return schemasStorage.getSchema(entityName);
        }

        function getSchemaProperty(propertyPath) {
            var arrPropertyPath = propertyPath.split(".");
            var entityName = arrPropertyPath[0];
            var propertyName = arrPropertyPath.slice(1, arrPropertyPath.length).join(".");
            
            var schema=getSchema(entityName);
            
            if (!schema) {
                throw new Error("No existe la entidad para el propertyPath:"+propertyPath);
            }
            
            return schema.getSchemaProperty(propertyName);
        }


    }



    angular.module("es.logongas.ix3").factory("schemaEntities", SchemaEntities);



    /**
     * Clase para gestionar varios objetos Schema
     * Y guarda cada uno de los metadatos de cada entidad.
     */
    function SchemasStorage(langUtil) {

        /**
         * Aqui guardamos cada uno de los metadatos de cada entidad
         */
        this.entities = {};

        this.addSchema = function (entityName, schema) {
            if (this.getSchema(entityName) === null) {
                this.entities[entityName] = schema;
            }
        };

        this.getSchema = function (entityName) {
            var schema = this.entities[entityName];
            if (schema) {
                return schema;
            } else {
                return null;
            }
        };


        /**
         * 
         * @param {String} entityName Nombre de la entidad
         * @param {Array[String]} arrExpands Los expandido que debe estar el schema. Se permiten varios valores , por eso es un array
         * @returns {Boolean} Si esta entidad existe y está expanjdida como dicen todos y cada uno de los valores de "expands"
         */
        this.existsSchema = function (entityName, arrExpands) {
            var schema = this.getSchema(entityName);
            if (schema === null) {
                return false;
            }

            for (var i = 0; i < arrExpands.length; i++) {
                if (schema.getSchemaProperty(arrExpands[i]) === null) {
                    return false;
                }
            }

            return true;
        };

        /**
         * Dado un "expand" obtiene el "expand" mas cercado que tiene esa propiedad.
         * Sirva para saber que parte ya está cargada de ese expand.
         * @param {type} entityName Nombre de la entidad
         * @param {type} propertyName Es como expand pero con un solo valor.
         * @returns {String}
         */
        this.getBestExistsProperty = function (entityName, propertyName) {
            propertyName = propertyName || "";
            if (propertyName.indexOf(",") >= 0) {
                throw new Error("No se permiten comas en el nombre de la propiedad");
            }

            var propertyExists = "";
            var current = this.getSchema(entityName);

            var keys = langUtil.splitValues(propertyName, ".");
            for (var i = 0; i < keys.length; i++) {
                current = current.properties[keys[i]];
                if (current === undefined) {
                    return propertyExists;
                } else {
                    //El operador ternario es para el primer elemento que no lleva "." al concatenar.
                    propertyExists = propertyExists + (propertyExists === "" ? "" : ".") + keys[i];
                }
            }

            return propertyExists;
        };


    }




})();