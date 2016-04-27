'use strict';

angular.module('resources.usuario', ['config.api'])

/**
 * Servicio que se encarga de la comunicación con el 
 * recurso "Usuario" del a API del sistema.
 *
 * @author Francisco Riveros.
 */
.factory('usuarioResource', ['$http', 'api', 
	function($http, api) {

		var _url = api.url+'usuarios/';

		/**
		 * Buscar un usuario específico en base a su código identificador
		 *
		 * @param idUsuario Código identificador del usuario.
		 * @return Promise
		 */
		function buscar(idUsuario) {
			return $http.get(_url+idUsuario, { cache : false });
		}

		/**
		 * Actualiza la información del usuario
		 *
		 * @param usuario Objeto con la información del usuario.
		 * @return Promise
		 */
		function actualizar(usuario) {		
			return $http.put(_url+usuario._id, usuario);
		}

		/**
		 * Crea un nuevo usuario en el sistema.
		 *
		 * @param usuario Objeto con la información del usuario.
		 * @return Promise
		 */
		function crear(usuario) {			
			return $http.post(_url, usuario);
		}

		/**
		 * Consulta al servidor si las credenciales del usuario
		 * son válidas.
		 * 
		 * @param email Cuenta de email del usuario
		 * @param password Clave del usuario
		 * @return Promise
		 */
		function login(email, password) {
			var usuario = { 
				email 		: email, 
				password 	: password 
			};

			return $http.post(api.url+'login', usuario);	
		}

		return {
			buscar 		: buscar,
			actualizar 	: actualizar,
			crear 		: crear,
			login 		: login
		};
	}
]);