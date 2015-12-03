// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'articles'
angular.module('tareas').controller('TareasController', ['$scope', '$routeParams', '$location', 'Authentication', 'Tareas',
    function($scope, $routeParams, $location, Authentication, Tareas) {
        // Exponer el service Authentication
        $scope.authentication = Authentication;

 // Crear un nuevo método controller para crear nuevos articles
        $scope.create = function() {
            // Usar los campos form para crear un nuevo objeto $resource article
            var article = new Articles({
                titulo: this.titulo,
                contenido: this.contenido
            });

            // Usar el método '$save' de article para enviar una petición POST apropiada
            article.$save(function(response) {
                // Si un artículo fue creado de modo correcto, redireccionar al usuario a la página del artículo 
                $location.path('articles/' + response._id);
            }, function(errorResponse) {
                // En otro caso, presentar al usuario el mensaje de error
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);