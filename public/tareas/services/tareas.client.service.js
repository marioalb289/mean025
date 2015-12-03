// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'articles'
angular.module('tareas').factory('Tareas', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' article
    return $resource('api/tareas/:tareaId', {
        tareaId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);