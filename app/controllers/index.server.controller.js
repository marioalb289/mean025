// Invocar modo JavaScript 'strict'
'use strict';
var User = require('mongoose').model('User'),
  passport = require('passport');
// Crear un nuevo método controller 'render'
exports.render = function(req, res) {
	// Usar el objeto 'response' para renderizar la view 'index' con un 'title' y propiedades 'userFullName'
	res.render('index', {
		title: 'Hola Mundo',
		user: JSON.stringify(req.user)
	});
};

// Crear un nuevo método controller que renderiza la página signin
exports.renderSignin = function(req, res, next) {
  // Si el usuario no está conectado renderizar la página signin, en otro caso redireccionar al usuario de vuelta a la página principal de la aplicación
  if (!req.user) {
    // Usa el objeto 'response' para renderizar la página signin
    res.render('signin', {
      // Configurar la variable title de la página
      title: 'Sign-in Form',
      // Configurar la variable del mensaje flash
      messages: req.flash('error') || req.flash('info'),
      user: JSON.stringify(req.user)
    });
  } else {
  	var name = req.user.firstName +' '+ req.user.lastName;
  	console.log(name);

    res.render('index', {
		title: 'Hola Mundo',
		user: JSON.stringify(req.user),
		userFullName: name,
	});
  }
};
