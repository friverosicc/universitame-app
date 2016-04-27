angular.module('session.infoUsuario', ['ngStorage'])

/**
 * Servicio encargado de mantener la información del usuario conectado 
 * en al sistema, para la utilización de esta a nivel de toda la aplicación.
 *
 * @author Francisco Riveros.
 *
 */
.factory('infoUsuario', [	
	'$localStorage', 
	'$sessionStorage',	
	function($localStorage, $sessionStorage) {	
		
		/**
		 * Guarda la información del usuario en el localstorage 
		 * del navegador.
		 *
		 * @param usuario Objeto con la información del usuario logeado.
		 */
		function save(usuario) {
			remove();
			$localStorage.usuario = usuario;
		}

		/**
		 * Devuelve la información del usuario registrada en el 
		 * localstorage del navegador.
		 *
		 * @return usuario Objeto con la información del usuario.
		 */
		function get() {
			return $localStorage.usuario;
		}

		/**
		 * Elimina la información del usuario desde el 
		 * localstorage.
		 */
		function remove() {
			delete $localStorage.usuario;
		}

		return {
			save 	: save,
			get 	: get,
			remove 	: remove
		};	
	}
]);