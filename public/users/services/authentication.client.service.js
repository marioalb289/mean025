angular.module('users').factory('Authentication', ['$resource','$q','$http',
  function($resource,$q,$http) {
    this.user = window.user;

    return {
      user: this.user,
	    Users: $resource('api/users/:userId', {
			        	tareaId: '@_id'
			    	}, {
				        update: {
				            method: 'PUT'
			       		}
			    	}),
    };
  }
]);