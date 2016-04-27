'use strict';

angular.module('security.interceptor', [
	'session.infoUsuario',
	'ui.router'
])

/**
 * Interceptor de las peticiones http realizadas a la API del sistema.
 *
 * @author Francisco Riveros.
 */
.factory('interceptor', [
	'Base64', 
	'infoUsuario',
	'$injector',
	'$q',
	function(Base64, infoUsuario, $injector, $q) {		
		/**
		 * Agrega las credenciales de autenticación de los usuarios 
		 * a cada petición realizada.
		 */
		function request(config) {
			var _usuario = infoUsuario.get();

			if(angular.isDefined(_usuario)) {
				config.headers.Authorization = 'Basic ' + Base64.encode(_usuario.id+':'+_usuario.token);
			} 		
		
			return config;
		}

		/**
		 * Verifica si el servidor devuelve un error 401, por acceso no autorizado
		 * para de esta forma redirigir al usuario a la página de login.
		 */
		function responseError(rejection) {		
			if(rejection.status === 401) {
				$injector.get('$state').go('logout');
			}

			return $q.reject(rejection);
		}

		return {
			request 		: request,
			responseError 	: responseError
		};
	}
])
.config(['$httpProvider', function($httpProvider){	
	$httpProvider.interceptors.push('interceptor');
}])

/**
 * Servicio utilizado para codificar y decodificar las credenciales 
 * los usuarios logeados.
 */
.factory('Base64', function () {
	/* jshint ignore:start */
  
	var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  
	/**
	 * Codifica el texto pasado como parámetro.
	 *
	 * @param input Texto que se desea codificar
	 *
	 * @return Texto codificado.
	 */
	function encode(input) {
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
  
		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
  
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
  
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
  
			output = output +
				keyStr.charAt(enc1) +
				keyStr.charAt(enc2) +
				keyStr.charAt(enc3) +
				keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
  
		return output;
	}
    
    /**
     * Decodifica el texto pasado como parámetro.
     *
     * @param input Texto a decodificar.
     *
     * @return Texto descodificado.
     */
    function decode(input) {
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
  
		// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		var base64test = /[^A-Za-z0-9\+\/\=]/g;
		if (base64test.exec(input)) {
			window.alert(	"There were invalid base64 characters in the input text.\n" +
							"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
							"Expect errors in decoding.");
		}
		
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		do {
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";

		} while (i < input.length);
  
		return output;
	}

	return {
		encode: encode,
		decode: decode 
	};
	/* jshint ignore:end */
});
