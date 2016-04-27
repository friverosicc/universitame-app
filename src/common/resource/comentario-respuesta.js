'use strict';
angular.module('resources.comentario-respuesta', ['config.api'])

/**
 * Servicio que se encarga de la comunicación con el recurso "Comentario de Respuesta"
 * de la API del sistema.
 *
 * @author Francisco Riveros.
 */
.factory('comentarioRespuestaResource', ['$http', '$interpolate', 'api',
	function($http, $interpolate, api) {
		var _templateURL = $interpolate(api.url+'publicaciones/{{idPublicacion}}/respuestas/{{idRespuesta}}/comentarios/{{idComentario}}');	



		/**		 
		 * Busca los comentarios que se encuentran registrados a
		"* una respuesta específica.
		 *
		 * @param idPublicacion Código identificador de la publicación
		 * de la cual se desean las respuestas.
		 * @param idRespuesta Código identificador de la respuesta.		 
		 * @param inicio Posición donde debe comenzar el paginador.
		 * @return Promise
		 */
		function buscar(idPublicacion, idRespuesta, inicio) {
			var url = _templateURL({ 
				idPublicacion 	: idPublicacion,
				idRespuesta 	: idRespuesta			
			});

			var params = { 				
				inicio : inicio 
			};			

			return $http.get(url, { params : params });
		}			

		/**
		 * Ingresa un nuevo comentario asociado a una respuesta
		 *
		 * @param idPublicacion Código identificador de la pregunta.
		 * @param idRespuesta Código identificador de la respuesta.
		 * @param comentario Objeto con la información del comentario.
		 * @return Promise
		 */
		function crear(idPublicacion, idRespuesta, comentario) {
			var url = _templateURL({ 
				idPublicacion 	: idPublicacion,
				idRespuesta 	: idRespuesta		
			});

			return $http.post(url, comentario);
		}		

		/**
		 * Elimina un comentario del sistema.
		 *
		 * @param idPublicacion Código identificador de la pregunta.
		 * @param idRespuesta Código identificador de la respuesta.
		 * @param idComentario Código identificador del comentario
		 * @return Promise
		 */
		function eliminar(idPublicacion, idRespuesta, idComentario) {
			var url = _templateURL({ 
				idPublicacion 	: idPublicacion,
				idRespuesta 	: idRespuesta,
				idComentario 	: idComentario
			});
			return $http.delete(url);	
		}				

		return {
			buscar 					: buscar,			
			crear 					: crear,
			eliminar 				: eliminar			
		};
	}
]);