angular.module('resources.instituciones', ['config.api'])
.factory('institucionesResource', ['$http','api',
	function($http, api) {		

		function buscar(params) {
			return $http.get(api.url+'instituciones', { params : params });
		}

		return {
			buscar : buscar
		};
	}	
]);