angular.module('resources.carreras', ['config.api'])

/**
 * Servicio que se encarga de la comunicación con el 
 * recurso "Carrera" de la API del sistema.
 *
 * @author Francisco Riveros.
 */
.factory('carrerasResource', ['$http','api',
	function($http, api) {		

		/**
		 * Busca todas las carreras dado el código de
		 * una Institución en específico.
		 *
		 * @param 	codigoInstitucion Código identificador de una Institucion
		 * 			de estudios superior.
		 *
		 * @return Promise
		 */
		function buscar(params) {		
			return $http.get(api.url+'carreras', { params : params });
		}

		return {
			buscar : buscar
		};
	}	
]);