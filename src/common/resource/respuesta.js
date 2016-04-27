'use strict';
angular.module('resources.respuesta', ['config.api'])

/**
 * Servicio que se encarga de la comunicación con el recurso "Respuesta"
 * de la API del sistema.
 *
 * @author Francisco Riveros.
 */
.factory('respuestaResource', ['$http', 'api',
	function($http, api) {
		var _url = api.url+'publicaciones/';
		var _end = '/respuestas';

		/**		 
		 * Busca las respuestas que se encuentran registradas a
		"* una pregunta específica.
		 *
		 * @param idPublicacion Código identificador de la publicación
		 * de la cual se desean las respuestas.
		 * @param idUsuario Código identificador del usuario que esta realizando la
		 * consulta de las respuestas de la publicación
		 * @return Promise
		 */
		function buscar(idPublicacion, idUsuario) {
			var params = { idUsuario : idUsuario };			
			return $http.get(_url+idPublicacion+_end, { params : params });
		}	

		/**
		 * Busca el detalle de una respuesta específica.
		 *
		 * @param idPublicacion Código identificador de la pregunta.
		 * @param idRespuesta Código identificador de la respuesta.
		 * @param idUsuario Código identificador del usuario que esta consultando por la respuesta.
		 * @return Promise
		 */
		function buscarUno(idPublicacion, idRespuesta, idUsuario) {
			var params = { idUsuario : idUsuario };			
			return $http.get(_url+idPublicacion+_end+'/'+idRespuesta, { params : params });
		}	

		/**
		 * Ingresa una nueva respuesta asociado a una publicación
		 *
		 * @param idPublicacion Código identificador de la pregunta.
		 * @param respuesta Objeto con la información de la pregunta.
		 * @return Promise
		 */
		function crear(idPublicacion, respuesta) {
			return $http.post(_url+idPublicacion+_end, respuesta);
		}

		/**
		 * Ingresa una aprobación a la respuesta de una pregunta específica.
		 *
		 * @param idPublicacion Código identificador de la pregunta.
		 * @param idRespuesta Código identificador de la respuesta.
		 * @return Promise
		 */
		function evaluar(idPublicacion, idRespuesta, aprobacion) {
			var params = { aprobacion : aprobacion };
			return $http.post(_url+idPublicacion+_end+'/'+idRespuesta+'/evaluaciones', params);
		}		

		/**
		 * Elimina la evaluación de "aprobación" o "reprobación" de una pregunta específica.
		 *
		 * @param idPublicacion Código identificador de la pregunta.
		 * @param idRespuesta Código identificador de la respuesta.
		 * @return Promise
		 */
		function eliminarEvaluacion(idPublicacion, idRespuesta) {
			return $http.delete(_url+idPublicacion+_end+'/'+idRespuesta+'/evaluaciones');
		}

		/**
		 * Elimina una respuesta del sistema.
		 *
		 * @param idPublicacion Código identificador de la pregunta.
		 * @param idRespuesta Código identificador de la respuesta.
		 * @return Promise
		 */
		function eliminar(idPublicacion, idRespuesta) {
			return $http.delete(_url+idPublicacion+_end+'/'+idRespuesta);	
		}

		/**
		 * Marca la respuesta como la mejor para una pregunta específica.
		 *
		 * @param idPublicacion Código identificador de la pregunta.
		 * @param idRespuesta Código identificador de la respuesta.
		 * @return Promise
		 */
		function elegirMejorRespuesta(idPublicacion, idRespuesta) {			
			return $http.post(_url+idPublicacion+_end+'/'+idRespuesta+'/mejor');
		}

		/**
		 * Quita la marca de "mejor" a una respuesta específica.
		 *
		 * @param idPublicacion Código identificador de la pregunta.
		 * @param idRespuesta Código identificador de la respuesta.
		 * @return Promise
		 */
		function eliminarMejorRespuesta(idPublicacion, idRespuesta) {			
			return $http.delete(_url+idPublicacion+_end+'/'+idRespuesta+'/mejor');
		}

		return {
			buscar 					: buscar,
			buscarUno 				: buscarUno,
			crear 					: crear,
			evaluar 				: evaluar,
			eliminarEvaluacion 		: eliminarEvaluacion,
			eliminar 				: eliminar,
			elegirMejorRespuesta 	: elegirMejorRespuesta,
			eliminarMejorRespuesta	: eliminarMejorRespuesta
		};
	}
]);