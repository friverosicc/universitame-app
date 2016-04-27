'use strict';

angular.module('universitame-app.admin.sugerencia', [
	'universitame-app.admin.sugerencia.detalle',
	'resources.sugerencia'
])
/**
 * Módulo encargado de administrar la vista de las sugerencias que
 * han sido ingresadas por los usuarios.
 *
 * @author Francisco Riveros A.
 */
.controller('sugerenciaController', [
	'$scope', 
	'$stateParams',
	'sugerenciaResource',
	function($scope, $stateParams, sugerenciaResource) {
		var _inicio = 0;
		var _total = 15;

		/**
		 * Busca las sugerencias que son listadas en la vista.
		 */
		$scope.buscarSugerencias = function() {
			var params = {
				inicio 	: _inicio,
				filtrar : $stateParams.filtrar
			};

			if(_inicio <= _total) {
				sugerenciaResource.buscar(params)
				.then(function(response) {							
					$scope.sugerencias = response.data.sugerencias;
					_total = response.data.cantidad;
					_inicio += 15;
				});
			}
		}
	}
]);