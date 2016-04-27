'use strict';
angular.module('resources.comentario-publicacion', ['config.api'])

/**
 * Servicio que se encarga de la comunicación con el recurso "Comentarios"
 * de "Publicación" de la API del sistema.
 *
 * @author Francisco Riveros.
 */
.factory('comentarioPublicacionResource', ['$http', 'api', '$interpolate',
	function($http, api, $interpolate) {

		var _templateURL = $interpolate(api.url+'publicaciones/{{idPublicacion}}/comentarios/{{idComentario}}');		

		/**		 
		 * Busca los comentarios que se encuentran registrados a
		"* una publicación específica.
		 *
		 * @param idPublicacion Código identificador de la publicación
		 * de la cual se desean los comentarios.
		 * @param idUsuario Código identificador del usuario que esta realizando la
		 * consulta de los comentarios de la publicación
		 * @return Promise
		 */
		function buscar(idPublicacion, idUsuario) {
			var url = _templateURL({ 
				idPublicacion 	: idPublicacion				
			});

			var params = { idUsuario : idUsuario };			

			return $http.get(url, { params : params });
		}	

		/**
		 * Busca el detalle de un comentario específico.
		 *
		 * @param idPublicacion Código identificador de la publicación.
		 * @param idComentario Código identificador del comentario.
		 * @param idUsuario Código identificador del usuario que esta consultando por el comentario.
		 * @return Promise
		 */
		function buscarUno(idPublicacion, idComentario, idUsuario) {
			var url = _templateURL({ 
				idPublicacion 	: idPublicacion,
				idComentario 	: idComentario			
			});
			var params = { idUsuario : idUsuario };			
			return $http.get(url, { params : params });
		}	

		/**
		 * Ingresa un nuevo comentario asociado a una publicación
		 *
		 * @param idPublicacion Código identificador de la publicación.
		 * @param comentario Objeto con la información del comentario.
		 * @return Promise
		 */
		function crear(idPublicacion, comentario) {
			var url = _templateURL({ 
				idPublicacion 	: idPublicacion				
			});
			return $http.post(url, comentario);
		}

		/**
		 * Ingresa una aprobación al comentario de una publicación específica.
		 *
		 * @param idPublicacion Código identificador de la publicación.
		 * @param idComentario Código identificador del comentario.
		 * @return Promise
		 */
		function evaluar(idPublicacion, idComentario, aprobacion) {
			var url = _templateURL({ 
				idPublicacion 	: idPublicacion,
				idComentario 	: idComentario			
			});
			var params = { aprobacion : aprobacion };
			return $http.post(url+'/evaluaciones', params);
		}		

		/**
		 * Elimina la evaluación de "aprobación" o "reprobación" de un comentario específico.
		 *
		 * @param idPublicacion Código identificador de la publicación.
		 * @param idComentario Código identificador del comentario.
		 * @return Promise
		 */
		function eliminarEvaluacion(idPublicacion, idComentario) {
			var url = _templateURL({ 
				idPublicacion 	: idPublicacion,
				idComentario 	: idComentario			
			});

			return $http.delete(url+'/evaluaciones');
		}

		/**
		 * Elimina un comentario del sistema.
		 *
		 * @param idPublicacion Código identificador de la publicación.
		 * @param idComentario Código identificador del comentario.
		 * @return Promise
		 */
		function eliminar(idPublicacion, idComentario) {
			var url = _templateURL({ 
				idPublicacion 	: idPublicacion,
				idComentario 	: idComentario			
			});

			return $http.delete(url);	
		}		

		return {
			buscar 					: buscar,
			buscarUno 				: buscarUno,
			crear 					: crear,
			evaluar 				: evaluar,
			eliminarEvaluacion 		: eliminarEvaluacion,
			eliminar 				: eliminar		
		};
	}
]);