// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var users = require('../../app/controllers/users.server.controller'),
	proyectos = require('../../app/controllers/proyectos.server.controller');

// Definir el método routes de module
module.exports = function(app) {
	// Configurar la rutas base a 'tareas'  
	app.route('/api/proyectos')
	   .get(proyectos.list)
	   .post(users.requiresLogin, proyectos.create);
	
	// Configurar las rutas 'tareas' parametrizadas
	app.route('/api/proyectos/:proyectoId')
	   .get(proyectos.read)
	   .put(users.requiresLogin, proyectos.hasAuthorization, proyectos.update)
	   .delete(users.requiresLogin, proyectos.hasAuthorization, proyectos.delete);

	// Configurar el parámetro middleware 'articleId'   
	app.param('proyectoId', proyectos.proyectoByID);
};