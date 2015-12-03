// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'tareas'
angular.module('tareas').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/tareas/list', {
			templateUrl: 'tareas/views/list-tareas.client.view.html'
		}).
		when('/tareas/create', {
			templateUrl: 'tareas/views/create-tarea.client.view.html'
		}).
		// when('/tareas/:tareaId', {
		// 	templateUrl: 'tareas/views/view-article.client.view.html'
		// }).
		when('/tareas/:tareaId/edit', {
			templateUrl: 'tareas/views/edit-tarea.client.view.html'
		});
	}
]); 