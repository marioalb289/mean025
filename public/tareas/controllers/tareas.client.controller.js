// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'articles'
angular.module('tareas').controller('TareasController', ['$scope','$filter', '$routeParams', '$location', 'Authentication', 'Tareas',
    function($scope,$filter, $routeParams, $location, Authentication, Tareas) {
        // Exponer el service Authentication
        $scope.authentication = Authentication;
        $scope.myDate = new Date();

        // Crear un nuevo método controller para crear nuevos articles
        $scope.create = function() {
            // Usar los campos form para crear un nuevo objeto $resource tarea
            console.log(this.tarea.titulo);
            var tarea = new Tareas({
                titulo: this.tarea.titulo,
            });

            // Usar el método '$save' de tarea para enviar una petición POST apropiada
            tarea.$save(function(response) {
                // Si un artículo fue creado de modo correcto, redireccionar al usuario a la página del artículo 
                // $location.path('tareas/' + response._id);
                $location.path('tareas/list');
            }, function(errorResponse) {
                // En otro caso, presentar al usuario el mensaje de error
                $scope.error = errorResponse.data.message;
            });
        };

        // Crear un nuevo método controller para recuperar una lista de tareas
        $scope.find = function() {
            // Usar el método 'query' de tarea para enviar una petición GET apropiada
            $scope.tareas = Tareas.query();
            console.log($scope.tareas);
        };

         // Crear un nuevo método controller para recuperar una unica Tarea
        $scope.findOne = function() {
            // Usar el método 'get' de tarea para enviar una petición GET apropiada
            // $state.go('editar');
            $scope.tarea = Tareas.get({
                tareaId: $routeParams.tareaId
            });
            var x = $scope.tarea; 
            // $scope.myNewDate = $filter('date')($scope.tarea.creado, 'longDate');
            console.log(x.creado);
            
        };

         // Crear un nuevo método controller para actualizar una unica tarea
        $scope.update = function() {
            // Usar el método '$update' de article para enviar una petición PUT apropiada
            $scope.article.$update(function() {
                // Si un article fue actualizado de modo correcto, redirigir el user a la página del article 
                $location.path('articles/' + $scope.article._id);
            }, function(errorResponse) {
                // En otro caso, presenta al user un mensaje de error
                $scope.error = errorResponse.data.message;
            });
        };
    }
]).config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
  });