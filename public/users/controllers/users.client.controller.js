// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'tareas'
angular.module('proyectos').controller('ProyectosController', ['$scope','$filter', '$routeParams', '$location','$mdDialog', 'Authentication', 'ApiProyectos','$timeout', '$q','$http','$mdToast',
    function($scope,$filter, $routeParams, $location,$mdDialog, Authentication,ApiProyectos,$timeout,$q,$http,$mdToast) {
        // Exponer el service Authentication
        $scope.authentication = Authentication;
        $scope.myDate = new Date();
        $scope.users = null;

        $scope.states = ('En Espera,En proceso,En Pausa,Terminada,Cancelada').split(',').map(function(seleccion) {
            return {abbrev: seleccion};
          });

        
        var x = null;
        ApiProyectos.getAll().then(function(data) {
            initChip(data);
            $scope.elementos = data;
        });

        var self = this;

        //cargar usuarios al arreglo de chips
        function initChip(data){
          self.querySearch = querySearch;
          self.allContacts = loadContacts(data);
          // console.log(self.allContacts);
          self.contacts = [];
          self.filterSelected = true;
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

        function loadContacts(data) {
          var contacts = [];
          for (var i = 0; i < data.length; i++) {
            contacts.push(data[i].fullName+' '+data[i]._id)
          };
          return contacts.map(function (c, index) {
            // console.log(c)
            var cParts = c.split(' ');
            var nombre = '';
            for (var i = 0; i < cParts.length; i++) {
              if(i == cParts.length-1){
                break;
              }
              nombre= nombre +' ' + cParts[i];
            };
            var contact = {
              id: cParts[cParts.length-1],
              name: nombre,
              email: cParts[0][0].toLowerCase() + '.' + cParts[1].toLowerCase() + '@example.com',
              image: 'http://lorempixel.com/50/50/people?' + index
            };
            contact._lowername = contact.name.toLowerCase();
            return contact;
          });
        }

        $scope.loadUsers = function() {
            // $scope.users = Api.Users.query();
            // console.log($scope.users);
        };

        // Crear un nuevo método controller para crear nuevos articles
        $scope.create = function() {
            // Usar los campos form para crear un nuevo objeto $resource tarea
            // console.log(this.ctrl.contacts);
            var proyecto = new ApiProyectos.Proyectos({
                titulo: this.proyecto.titulo,
                descripcion: this.proyecto.descripcion
            });

            // console.log(this.tarea);

            // Usar el método '$save' de tarea para enviar una petición POST apropiada
            proyecto.$save(function(response) {
                // Si un artículo fue creado de modo correcto, redireccionar al usuario a la página del artículo 
                // $location.path('tareas/' + response._id);
                $location.path('proyectos/list');

            }, function(errorResponse) {
                // En otro caso, presentar al usuario el mensaje de error
                $scope.error = errorResponse.data.message;
            });
        };

        // Crear un nuevo método controller para recuperar una lista de tareas
        $scope.find = function() {
            // Usar el método 'query' de tarea para enviar una petición GET apropiada
            $scope.proyectos = ApiProyectos.Proyectos.query();
            console.log($scope.proyectos);
        };

         // Crear un nuevo método controller para recuperar una unica Tarea
        $scope.findOne = function() {
            // Usar el método 'get' de tarea para enviar una petición GET apropiada
            // $state.go('editar');
            $scope.proyecto = ApiProyectos.Proyectos.get({
                proyectoId: $routeParams.proyectoId
            },function(_data){
                 _data.creado = new Date(_data.creado);
                 // self.contacts = [self.allContacts[0],self.allContacts[1]];
            });
            // var x = $scope.tarea; 
            // $scope.myNewDate = $filter('date')($scope.tarea.creado, 'longDate');
            // console.log(x.creado);
            
        };

         // Crear un nuevo método controller para actualizar una unica tarea
        $scope.update = function() {
            // Usar el método '$update' de article para enviar una petición PUT apropiada
            $scope.proyecto.$update(function() {
                // Si un article fue actualizado de modo correcto, redirigir el user a la página del article 
                $location.path('proyectos/list');
            }, function(errorResponse) {
                // En otro caso, presenta al user un mensaje de error
                $scope.error = errorResponse.data.message;
            });
        };

        // Crear un nuevo método controller para borrar una unica tarea
        $scope.delete = function(proyecto,ev) {

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('¿ Eliminar Proyectos ?')
                  .content('Se eliminaran todos los datos relacionados a la Proyecto incluida sus tareas')
                  .ariaLabel('Lucky day')
                  .targetEvent(ev)
                  .ok('Eliminar')
                  .cancel('Caneclar');

            $mdDialog.show(confirm).then(function() {
                //ok
                // Si una tarea fue enviado al método, borrarlo
                if (proyecto) {
                    // Usar el método '$remove' del tarea para borrar la tarea
                    proyecto.$remove(function() {
                        // Eliminar el artículo de la lista de artículos
                        for (var i in $scope.proyectos) {
                            if ($scope.proyectos[i] === proyecto) {
                                $scope.proyectos.splice(i, 1);
                            }
                        }
                    });
                } else {
                    // En otro caso, usar el método '$remove' de tarea para borrar la tarea
                    $scope.proyecto.$remove(function() {
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