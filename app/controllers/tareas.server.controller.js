// Invocar el modo 'strict'
'use strict';

// Cargar las dependencias del módulo
var mongoose = require('mongoose'),
	Tareas = mongoose.model('Tareas');

// Crear un nuevo método controller que recupera una lista de artículos
exports.list = function(req, res) {
	// Usar el método model 'find' para obtener una lista de artículos
	Tareas.find().sort('-creado').populate('creador', 'firstName lastName fullName').exec(function(err, articles) {
		if (err) {
			// Si un error ocurre enviar un mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(articles);
		}
	});
};