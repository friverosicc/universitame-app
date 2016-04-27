'use strict';
angular.module('resources.sugerencia', ['config.api'])

/**
 * Servicio que se encarga de la comunicación con el recurso "Sugerencia"
 * de la API del sistema.
 *
 * @author Francisco Riveros
 */
.factory('sugerenciaResource', ['$http', '$interpolate', 'api',
	function($http, $interpolate, api) {
		var _templateURL = $interpolate(api.url+'sugerencias/{{idSugerencia}}');	

		/**
		 * Ingresa una nueva sugerencia de usuario
		 *
		 * @param sugerencia Objeto con la información de la sugerencia
		 * return Promise
		 */
		function crear(sugerencia) {
			return $http.post(_templateURL(), sugerencia);
		}

		/**
		 * Busca las sugerencias ingresadas por los usuarios.
		 *
		 * @param params Parámetros de búsquda de las sugerencias.
		 * @return Promise
		 */
		function buscar(params) {							
			return $http.get(_templateURL(), { params : params });
		}

		/**
		 * Busca la información de una sugerencia específica.
		 *
		 * @param idSugerencia Código identificador de la sugerencia.
		 * @return Promise
		 */
		function buscarUno(idSugerencia) {
			return $http.get(_templateURL({ idSugerencia : idSugerencia}))
		}

		/**
		 * Actualiza la información de una sugerencia.
		 *
		 * @param idSugerencia Código identificador de la sugerencia
		 * @param sugerencia Objeto con la información de la sugerencia.
		 * @return Promise
		 */
		function actualizar(idSugerencia, sugerencia) {
			return $http.put(_templateURL({ idSugerencia : idSugerencia }), sugerencia);
		}

		return {
			crear 		: crear,
			buscar 		: buscar,
			buscarUno 	: buscarUno,
			actualizar 	: actualizar
		};
	}
]);