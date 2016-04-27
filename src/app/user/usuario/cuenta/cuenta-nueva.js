"use strict";

angular.module('universitame-app.user.usuario.cuenta', [
	'ui.router',
	'directives.ngEnter',
	'config.api',	
	'resources.usuario'
])
.controller('cuentaNuevaController', [
	'$scope',
	'$state',
	'$window',
	'api',	
	'usuarioResource',
	function($scope, $state, $window, api, usuarioResource) {			
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
		$scope.sePuedeGuardar = function() {			
			return $scope.nuevaCuentaForm.$valid && $scope.passwordIguales;
		};	

		/**
		 * Envía la información de la nueva cuenta de usuario al servidor.
		 */
		$scope.guardarUsuario = function() {
			usuarioResource.crear($scope.usuario).
			success(function(data) {										
				$state.transitionTo('session', {					
					id			: data.id,
					token		: $scope.usuario.password
				});
			}).
			error(function(data) {
				$scope.msgServer = data.msg;
			});
		}

		// Verificamos que las contraseñas sean iguales
		$scope.$watch('usuario.password', _sonPasswordsIguales);
		$scope.$watch('usuario.repassword', _sonPasswordsIguales);

		/**
		 * Valida que las contraseñas ingresadas sean iguales.
		 */
		function _sonPasswordsIguales() {
			if(angular.isUndefined($scope.usuario)) 
				$scope.passwordIguales = true;
			else
				if(angular.isUndefined($scope.usuario.password) || angular.isUndefined($scope.usuario.repassword))
					$scope.passwordIguales = true;
				else 
					$scope.passwordIguales = ($scope.usuario.password === $scope.usuario.repassword);
		}
	}
]);