// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'tareas'
angular.module('users').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/users/list', {
			templateUrl: 'users/views/list-users.client.view.html'
		}).
		when('/users/create', {
			templateUrl: 'users/views/create-users.client.view.html'
		}).
		// when('/tareas/:tareaId', {
		// 	templateUrl: 'tareas/views/view-article.client.view.html'
		// }).
		when('/users/:userId/edit', {
			templateUrl: 'users/views/edit-users.client.view.html'
		});
	}
]); 