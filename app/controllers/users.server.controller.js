// Invocar el modo 'strict'
'use strict';

// Cargar el módulo dependencies
var User = require('mongoose').model('User'),
  passport = require('passport');

// Crear un nuevo método controller manejador de errores
var getErrorMessage = function(err) {
  // Definir la variable de error message
  var message = '';

  // Si un error interno de MongoDB ocurre obtener el mensaje de error
  if (err.code) {
    switch (err.code) {
      // Si un eror de index único ocurre configurar el mensaje de error
      case 11000:
      case 11001:
        message = 'Usuario ya existe';
        break;
      // Si un error general ocurre configurar el mensaje de error
      default:
        message = 'Se ha producido un error';
    }
  } else {
    // Grabar el primer mensaje de error de una lista de posibles errores
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  // Devolver el mensaje de error
  return message;
};

// Crear un nuevo método controller que recupera una lista de usuarios
exports.list = function(req, res) {
  // Usar el método model 'find' para obtener una lista de usuarios
  User.find().sort('-creado').exec(function(err, users) {
    if (err) {
      // Si un error ocurre enviar un mensaje de error
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Enviar una representación JSON de usurios 
      res.json(users);
    }
  });
};
// Crear un nuevo método controller que devuelve un usuario existente
exports.read = function(req, res) {
  res.json(req.user);
};

// Crear un nuevo método controller para crear nuevos USUARIOS
exports.create = function(req, res, next) {
    // Crear una nueva instancia del modelo 'User'
    var user = new User(req.body);
    var message = null;

    // Configurar la propiedad user provider
    user.provider = 'local';

    // Intenta salvar el nuevo documento user
    user.save(function(err) {
      // Si ocurre un error, usa el mensaje flash para reportar el error
      if (err) {
        // Si ocurre algún error enviar el mensaje de error
        return res.status(400).send({
          message: getErrorMessage(err)
        });
      } else {
        // Enviar una representación JSON del usuario 
        res.json(user);
      }
    });
};
// Crear un nuevo método controller que actualiza un usuario existente
exports.update = function(req, res) {
  // Obtener la tarea usando el objeto 'request'
  var user = req.user;

  // Actualizar los campos usuario
  user.firstName = req.body.nombre;
  user.lastName =  req.body.apellido;
  user.email =  req.body.emial;
  user.username =  req.body.usuario;
  user.password =  req.body.password;

  // Intentar salvar la tarea actualizada
  user.save(function(err) {
    if (err) {
      // si ocurre un error enviar el mensaje de error
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Enviar una representación JSON del artículo 
      res.json(user);
    }
  });
};

// Crear un nuevo controller middleware que recupera un único usuario existente
exports.userByID = function(req, res, next, id) {
  // Usar el método model 'findById' para encontrar una única tarea
  User.findById(id).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Fallo al cargar el usuario ' + id));

    // Si una tarea es encontrado usar el objeto 'request' para pasarlo al siguietne middleware
    req.user = user;

    // Llamar al siguiente middleware
    next();
  });
};

// Crear un nuevo método controller que borre un usuario existente
exports.delete = function(req, res) {
  // Obtener el artículo usando el objeto 'request'
  var user = req.user;

  // Usar el método model 'remove' para borrar la tarea
  user.remove(function(err) {
    if (err) {
      // Si ocurre un error enviar el mensaje de error
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Enviar una representación JSON del artículo 
      res.json(user);
    }
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
      messages: req.flash('error') || req.flash('info')
    });
  } else {
    return res.redirect('/');
  }
};

// Crear un nuevo método controller que renderiza la página signup
exports.renderSignup = function(req, res, next) {
  // Si el usuario no está conectado renderizar la página signin, en otro caso redireccionar al usuario de vuelta a la página principal de la aplicación
  if (!req.user) {
    // Usa el objeto 'response' para renderizar la página signup
    res.render('signup', {
      // Configurar la variable title de la página
      title: 'Sign-up Form',
      // Configurar la variable del mensaje flash
      messages: req.flash('error')
    });
  } else {
    return res.redirect('/');
  }
};

// Crear un nuevo método controller que crea nuevos users 'regular'
exports.signup = function(req, res, next) {
  // Si user no está conectado, crear y hacer login a un nuevo usuario, en otro caso redireccionar el user de vuelta a la página de la aplicación principal
  if (!req.user) {
    // Crear una nueva instancia del modelo 'User'
    var user = new User(req.body);
    var message = null;

    // Configurar la propiedad user provider
    user.provider = 'local';

    // Intenta salvar el nuevo documento user
    user.save(function(err) {
      // Si ocurre un error, usa el mensaje flash para reportar el error
      if (err) {
        // Usa el método de manejo de errores para obtener el mensaje de error
        var message = getErrorMessage(err);

        // Configura los mensajes flash
        req.flash('error', message);

        // Redirecciona al usuario de vuelta a la página signup
        return res.redirect('/signup');
      }

      // Si el usuario fue creado de modo correcto usa el método 'login' de Passport para hacer login
      req.login(user, function(err) {
        // Si ocurre un error de login moverse al siguiente middleware
        if (err) return next(err);

        // Redireccionar al usuario de vuelta a la página de la aplicación principal
        return res.redirect('/');
      });
    });
  } else {
    return res.redirect('/');
  }
};

// Crear un nuevo método controller que crea nuevos usuarios 'OAuth'
exports.saveOAuthUserProfile = function(req, profile, done) {
  // Prueba a encontrar un documento user que fue registrado usando el actual provider OAuth
  User.findOne({
    provider: profile.provider,
    providerId: profile.providerId
  }, function(err, user) {
    // Si ha ocurrido un error continua al siguiente middleware
    if (err) {
      return done(err);
    } else {
      // Si un usuario no ha podido ser encontrado, crea un nueo user, en otro caso, continua al siguiente middleware
      if (!user) {
        // Configura un posible username base username
        var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');

        // Encuentra un username único disponible
        User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
          // Configura el nombre de usuario disponible 
          profile.username = availableUsername;
          
          // Crear el user
          user = new User(profile);

          // Intenta salvar el nuevo documento user
          user.save(function(err) {
            // Continúa al siguiente middleware
            return done(err, user);
          });
        });
      } else {
        // Continúa al siguiente middleware
        return done(err, user);
      }
    }
  });
};

// Crear un nuevo método controller para signing out
exports.signout = function(req, res) {
  // Usa el método 'logout' de Passport para hacer logout
  req.logout();

  // Redirecciona al usuario de vuelta a la página de la aplicación principal
  res.redirect('/');
};

// Crear un nuevo middleware controller que es usado para autorizar operaciones de autentificación 
exports.requiresLogin = function(req, res, next) {
  // Si un usuario no está autentificado envía el mensaje de error apropiado
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'Usuario no está identificado'
    });
  }

  // Llamar al siguiente middleware
  next();
};