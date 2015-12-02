angular.module('example').controller('ExampleController', ['$scope', 'Authentication',
  function($scope, Authentication) {
  	console.log(Authentication);
    $scope.authentication = Authentication;
  }
]);