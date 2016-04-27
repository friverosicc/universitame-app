'use strict';
angular.module('resources.publicacion', ['config.api'])

/**
 * Servicio que se encarga de la comunicación con el 
 * recurso "Publicacion" del a API del sistema.
 *
 * @author Francisco Riveros.
 */
.factory('publicacionResource', ['$http', 'api',
	function($http, api) {
		var _url = api.url+'publicaciones/';

		/**
		 * Busca las publicaciones que se encuentran registradas.
		 *		
		 * @param inicio Posición donde debe comenzar el paginador.
		 * @param params Objeto con información adicional para la búsqueda
		 * @return Promise
		 */
		function buscar(inicio, params) {
			params.inicio = inicio;
			return $http.get(_url, { params : params });
		}		

		/**
		 * Crear una nueva publicacion en el sistema
		 *
		 * @param publicacion Objeto con la información de la publicacion.
		 * @return Promise
		 */
		function crear(publicacion) {
			return $http.post(_url, publicacion);
		}		

		/**
		 * Busca el detalle de una publicación específica.
		 *
		 * @idPublicacion Código identificador de la publicación
		 * @param idUsuario Código identificador del usuario que esta realizando la
		 * consulta de las respuestas de la publicación
		 * @return Promise
		 */
		function buscarUno(idPublicacion, idUsuario) {
			var params = { idUsuario : idUsuario };	
			return $http.get(_url+idPublicacion, { params : params });
		}

		/**
		 * Elimina una respuesta del sistema.
		 *
		 * @param idPublicacion Código identificador de la pregunta.		 
		 * @return Promise
		 */
		function eliminar(idPublicacion) {
			return $http.delete(_url+idPublicacion);	
		}

		/**
		 * Ingresa una aprobación a una publicación específica.
		 *
		 * @param idPublicacion Código identificador de la publicación.		
		 * @return Promise
		 */
		function evaluar(idPublicacion, aprobacion) {
			var params = { aprobacion : aprobacion };
			return $http.post(_url+idPublicacion+'/evaluaciones', params);
		}		

		/**
		 * Elimina la evaluación de "aprobación" o "reprobación" de una publicación específica.
		 *
		 * @param idPublicacion Código identificador de la publicación
		 * @return Promise
		 */
		function eliminarEvaluacion(idPublicacion) {
			return $http.delete(_url+idPublicacion+'/evaluaciones');
		}

		return {
			buscar 				: buscar,
			crear 				: crear,
			buscarUno 			: buscarUno,
			eliminar 			: eliminar,
			evaluar 			: evaluar,
			eliminarEvaluacion 	: eliminarEvaluacion
		};
	}
]);