'use strict';
angular.module('universitame-app.user.common.sugerencia', [
	'resources.sugerencia'	
])

/**
 * Controlador de la vista del formulario de ingreso de sugerencias.
 *
 * @author Francisco Riveros
 */
.controller('nuevaSugerenciaController', [
	'$scope', 
	'$timeout',
	'sugerenciaResource',
	function($scope, $timeout, sugerenciaResource) {
		$scope.mostrarMensaje = false;
		$scope.sugerencia = {};
		$scope.open = true;

		$scope.esPosibleIngresar = function() {
			if(angular.isUndefined($scope.nuevaSugerenciaForm)) {
				return false;
			} else {				
				return $scope.nuevaSugerenciaForm.$valid;
			}		
		};


		$scope.ingresar = function() {
			$scope.sugerencia.fecha = Date.now();			
			
			sugerenciaResource.crear($scope.sugerencia)
			.then(function(response) {
				$scope.mostrarMensaje = true;

				$timeout(function() {
					$scope.$hide();
				}, 3000);
			});
		};
	}
]);