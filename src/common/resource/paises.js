angular.module('resources.paises', ['config.api'])
.factory('paisesResource', ['$http', 'api',
	function($http, api) {

		var _url = api.url+'paises';

		function buscar() {			
			return $http.get(_url);
		}

		return { 
			buscar : buscar
		};
	}
]);