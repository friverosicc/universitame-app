angular.module('resources.notificacion', ['config.api'])

/**
 * Servicio que se encarga de la comunicación con el 
 * recurso "Notificación" de la API del sistema.
 *
 * @author Francisco Riveros.
 */
.factory('notificacionResource', ['$http','api',
	function($http, api) {		

		/**
		 * Busca todas las notificaciones del usuario que se encuentra conectado.
		 *
		 * @return Promise
		 */
		function buscar(params) {		
			return $http.get(api.url+'notificaciones');
		}

		/**
		 * Elimina una notificación del sistema.
		 *
		 * @param idNotificacion Código identificador de la notificación.
		 * @return Promise
		 */
		function eliminar(idNotificacion) {			
			return $http.delete(api.url+'notificaciones/'+idNotificacion);	
		}

		return {
			buscar 		: buscar,
			eliminar 	: eliminar
		};
	}	
]);