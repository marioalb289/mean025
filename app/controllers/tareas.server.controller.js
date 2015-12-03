// Invocar el modo 'strict'
'use strict';

// Cargar las dependencias del módulo
var mongoose = require('mongoose'),
	Tarea = mongoose.model('Tarea');
// Crear un nuevo método controller para el manejo de errores
var getErrorMessage = function(err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Error de servidor desconocido';
	}
};
// Crear un nuevo método controller que recupera una lista de tareas
exports.list = function(req, res) {
	// Usar el método model 'find' para obtener una lista de tareas
	Tarea.find().sort('-creado').populate('creador', 'firstName lastName fullName').exec(function(err, tareas) {
		if (err) {
			// Si un error ocurre enviar un mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(tareas);
		}
	});
};

// Crear un nuevo método controller para crear nuevos TAREAS
exports.create = function(req, res) {
	// Crear un nuevo objeto artículo
	var tarea = new Tarea(req.body);
	console.log(tarea);

	// Configurar la propiedad 'creador' de la tarea
	tarea.creador = req.user;

	// Intentar salvar el artículo
	tarea.save(function(err) {
		if (err) {
			// Si ocurre algún error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON de la tarea 
			res.json(tarea);
		}
	});
};

// Crear un nuevo método controller que devuelve una tarea existente
exports.read = function(req, res) {
	res.json(req.tarea);
};

// Crear un nuevo método controller que actualiza una tarea existente
exports.update = function(req, res) {
	// Obtener la tarea usando el objeto 'request'
	var tarea = req.tarea;

	// Actualizar los campos tarea
	tarea.titulo = req.body.titulo;

	// Intentar salvar la tarea actualizada
	tarea.save(function(err) {
		if (err) {
			// si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(tarea);
		}
	});
};

// Crear un nuevo controller middleware que recupera una única tarea existente
exports.tareaByID = function(req, res, next, id) {
	// Usar el método model 'findById' para encontrar una única tarea
	Tarea.findById(id).populate('creador', 'firstName lastName fullName').exec(function(err, tarea) {
		if (err) return next(err);
		if (!tarea) return next(new Error('Fallo al cargar la tarea ' + id));

		// Si una tarea es encontrado usar el objeto 'request' para pasarlo al siguietne middleware
		req.tarea = tarea;

		// Llamar al siguiente middleware
		next();
	});
};

// Crear un nuevo método controller que borre una tarea existente
exports.delete = function(req, res) {
	// Obtener el artículo usando el objeto 'request'
	var tarea = req.tarea;

	// Usar el método model 'remove' para borrar la tarea
	tarea.remove(function(err) {
		if (err) {
			// Si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(tarea);
		}
	});
};

// Crear un nuevo controller middleware que es usado para autorizar una operación tarea 
exports.hasAuthorization = function(req, res, next) {
	// si el usuario actual no es el creador de la tarea, enviar el mensaje de error apropiado
	if (req.tarea.creador.id !== req.user.id) {
		return res.status(403).send({
			message: 'Usuario no está autorizado'
		});
	}

	// Llamar al siguiente middleware
	next();
};