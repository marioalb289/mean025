// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'Api'
angular.module('tareas').factory('Api', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' de la api, incluye tarea y usuarios
	return{
		Tareas: $resource('api/tareas/:tareaId', {
				        	tareaId: '@_id'
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
			    	})
		}
}]);