// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'Api'
angular.module('proyectos').factory('ApiProyectos', ['$resource','$q','$http', function($resource,$q,$http) {
	// Usar el service '$resource' para devolver un objeto '$resource' de la api, incluye tarea y usuarios
	return{
		Proyectos: $resource('api/proyectos/:proyectoId', {
				        	proyectoId: '@_id'
				    	}, {
				        	update: {
				            method: 'PUT'
				        }
				}),
	    Users: $resource('api/users/:userId', {
			        	tareaId: '@_id'
			    	}, {
				        update: {
				            method: 'PUT'
			       		}
			    	}),
	    getAll: getAll
		}
	function getAll () {
	        var defered = $q.defer();
	        var promise = defered.promise;

	        $http.get('/api/users')
	            .success(function(data) {
	                defered.resolve(data);
	            })
	            .error(function(err) {
	                defered.reject(err)
	            });

	        return promise;
	    }
}]);