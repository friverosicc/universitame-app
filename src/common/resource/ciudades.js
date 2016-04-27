'use strict';
angular.module('resources.ciudades', ['config.api'])
.factory('ciudadesResource', ['$http','api',
	function($http, api) {		

		function buscar(params) {
			return $http.get(api.url+'ciudades', { params : params });
		}

		return {
			buscar : buscar
		};
	}	
]);