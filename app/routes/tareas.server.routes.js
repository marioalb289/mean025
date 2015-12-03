// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var users = require('../../app/controllers/users.server.controller'),
	tareas = require('../../app/controllers/tareas.server.controller');

// Definir el método routes de module
module.exports = function(app) {
	// Configurar la rutas base a 'tareas'  
	app.route('/api/tareas')
	   .get(tareas.list)
	   .post(users.requiresLogin, tareas.create);
	
	// Configurar las rutas 'tareas' parametrizadas
	app.route('/api/tareas/:tareaId')
	   .get(tareas.read)
	   .put(users.requiresLogin, tareas.hasAuthorization, tareas.update)
	   .delete(users.requiresLogin, tarea.hasAuthorization, tareas.delete);

	// Configurar el parámetro middleware 'articleId'   
	app.param('tareaId', tareas.articleByID);
};