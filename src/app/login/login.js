'use strict';

angular.module('universitame-app.login', [
	'ui.router',
	'directives.ngEnter',
	'session.infoUsuario',
	'config.api',
	'resources.usuario'	
])
.config(['$stateProvider', function($stateProvider) {	

	$stateProvider.state('login', { 
		url 	: '/login',
		views 	: {
			'app-view' : {				
				templateUrl : 'login/login.tpl.html',
				controller 	: 'loginController'
			}
		}		
	});
}])

/**
 * Controlador encargado de administra la vista de login del sistema.
 *
 * @author Francisco Riveros.
 */
.controller('loginController', [
	'$scope', 
	'$http',
	'$state',
	'$window',
	'infoUsuario',
	'api',
	'usuarioResource',	
	function(	$scope, 
				$http, 
				$state, 
				$window, 
				infoUsuario, 
				api,
				usuarioResource,
				$cookies) {		

		var usuario = infoUsuario.get();

		// Si la sessión del usuario esta activa
		// se redirige al home o al registro.
		if(usuario) {
			$state.go('home.preguntas');
		}

		/**
		 * Redirije la aplicación hacia el servicio 
		 * de inicio de sessión de Facebook.
		 */
		$scope.facebookLogin = function() {			
			$window.location.href = api.urlFacebookLogin;
		};

		/**
		 * Verifica si el valor del campo es válido.
		 *
		 * @param ngModelController Campo del formulario.
		 * @param error Tipo de validación.
		 *
		 * @return TRUE si es válido, FALSE en caso contrario.
		 */
		$scope.showError = function(ngModelController, error) {				
			return ngModelController.$error[error] && ngModelController.$dirty;
		};

		/**
		 * Verifica si los valores del formulario de login
		 * son válidos.
		 * 
		 * @return TRUE si los valores son válidos, 
		 * FALSE en caso contrario.
		 */
		$scope.sePuedeIngresar = function() {			
			return $scope.loginForm.$valid && $scope.loginForm.$dirty;
		};

		/**
		 * Verifica con el servidor si la información del 
		 * email y password son válidas.		 
		 */
		$scope.ingresar = function() {
			usuarioResource.login($scope.usuario.email, $scope.usuario.password)
			.success(function(data) {							
				return usuarioResource.buscar(data.id);
			})
			.success(function(data) {					
				infoUsuario.save({ 
					id 		: data._id, 
					token 	: $scope.usuario.password 
				});

				if(data.esta_registrado) {					
					$state.go('home.preguntas');
				} else {					
					$state.go('session', { id : data.id, token :  $scope.usuario.password });
				}
			})
			.error(function(data) {				
				$scope.msgServer = data.msg;				
			}); 
		}
	}
]);
