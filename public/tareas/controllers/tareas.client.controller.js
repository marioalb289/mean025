// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'tareas'
angular.module('tareas').controller('TareasController', ['$scope','$filter', '$routeParams', '$location','$mdDialog', 'Authentication', 'Api','$timeout', '$q','$http',
    function($scope,$filter, $routeParams, $location,$mdDialog, Authentication,Api,$timeout,$q,$http) {
        // Exponer el service Authentication
        $scope.authentication = Authentication;
        $scope.myDate = new Date();
        $scope.users = null;

        var comun = {};

        comun.usuarios = [];

        $scope.states = ('En Espera,En proceso,En Pausa,Terminada,Cancelada').split(',').map(function(seleccion) {
            return {abbrev: seleccion};
          });

        var self = this;
        self.querySearch = querySearch;
        self.allContacts = loadContacts();
        self.contacts = [self.allContacts[0]];
        self.filterSelected = true;
        self.prueba;
        console.log(comun);


        function prueba(){
          return $http.get('/api/users')
          .success(function(data){
              console.log(data);
              angular.copy(data, comun.usuarios)

              return comun.usuarios
          })  
        }

        /**
         * Search for contacts.
         */
        function querySearch (query) {
          var results = query ?
              self.allContacts.filter(createFilterFor(query)) : [];
          return results;
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);

          return function filterFn(contact) {
            return (contact._lowername.indexOf(lowercaseQuery) != -1);;
          };

        }

        function loadContacts() {
          var contacts = [
            'Marina Augustine',
            'Oddr Sarno',
            'Nick Giannopoulos',
            'Narayana Garner',
            'Anita Gros',
            'Megan Smith',
            'Tsvetko Metzger',
            'Hector Simek',
            'Some-guy withalongalastaname'
          ];

          return contacts.map(function (c, index) {
            // console.log(c)
            var cParts = c.split(' ');
            var contact = {
              name: c,
              email: cParts[0][0].toLowerCase() + '.' + cParts[1].toLowerCase() + '@example.com',
              image: 'http://lorempixel.com/50/50/people?' + index
            };
            contact._lowername = contact.name.toLowerCase();
            return contact;
          });
        }

        $scope.loadUsers = function() {
            $scope.users = Api.Users.query();
            console.log($scope.users);
        };

        // Crear un nuevo método controller para crear nuevos articles
        $scope.create = function() {
            // Usar los campos form para crear un nuevo objeto $resource tarea
            console.log(this.user._id);
            var tarea = new Api.Tareas({
                titulo: this.tarea.titulo,
                descripcion: this.tarea.descripcion,
                terminadoCompromiso: this.tarea.terminadoCompromiso,
                status: this.tarea.status

            });

            console.log(this.tarea);

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
            $scope.tareas = Api.Tareas.query();
            console.log($scope.tareas);
        };

         // Crear un nuevo método controller para recuperar una unica Tarea
        $scope.findOne = function() {
            // Usar el método 'get' de tarea para enviar una petición GET apropiada
            // $state.go('editar');
            $scope.tarea = Api.Tareas.get({
                tareaId: $routeParams.tareaId
            },function(_data){
                 _data.creado = new Date(_data.creado);
                 _data.terminadoCompromiso = new Date(_data.terminadoCompromiso);
            });
            var x = $scope.tarea; 
            // $scope.myNewDate = $filter('date')($scope.tarea.creado, 'longDate');
            console.log(x.creado);
            
        };

         // Crear un nuevo método controller para actualizar una unica tarea
        $scope.update = function() {
            // Usar el método '$update' de article para enviar una petición PUT apropiada
            $scope.tarea.$update(function() {
                // Si un article fue actualizado de modo correcto, redirigir el user a la página del article 
                $location.path('tareas/list');
            }, function(errorResponse) {
                // En otro caso, presenta al user un mensaje de error
                $scope.error = errorResponse.data.message;
            });
        };

        // Crear un nuevo método controller para borrar una unica tarea
        $scope.delete = function(tarea,ev) {

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('¿ Eliminar Tarea ?')
                  .content('Se eliminaran todos los datos relacionados a la tarea')
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .ok('Eliminar')
                  .cancel('Caneclar');

            $mdDialog.show(confirm).then(function() {
                //ok
                // Si una tarea fue enviado al método, borrarlo
                if (tarea) {
                    // Usar el método '$remove' del tarea para borrar la tarea
                    tarea.$remove(function() {
                        // Eliminar el artículo de la lista de artículos
                        for (var i in $scope.tareas) {
                            if ($scope.tareas[i] === tarea) {
                                $scope.tareas.splice(i, 1);
                            }
                        }
                    });
                } else {
                    // En otro caso, usar el método '$remove' de tarea para borrar la tarea
                    $scope.tarea.$remove(function() {
                        // $location.path('tareas/list');
                    });
                }
            }, function() {
                //cancel
              // $scope.status = 'You decided to keep your debt.';
            });

            
        };

    }
]).config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
  });