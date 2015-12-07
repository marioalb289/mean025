// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'tareas'
angular.module('proyectos').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/proyectos/list', {
			templateUrl: 'proyectos/views/list-proyectos.client.view.html'
		}).
		when('/proyectos/create', {
			templateUrl: 'proyectos/views/create-proyecto.client.view.html'
		}).
		// when('/tareas/:tareaId', {
		// 	templateUrl: 'tareas/views/view-article.client.view.html'
		// }).
		when('/proyectos/:proyectoId/edit', {
			templateUrl: 'proyectos/views/edit-proyecto.client.view.html'
		});
	}
]); 