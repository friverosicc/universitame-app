'use strinct';

angular.module('universitame-app.admin.sugerencia.detalle', [
	'resources.sugerencia'
])

/**
 * Controlador de la vista que contiene el formulario de respuesta
 * a sugerencia y la visualización del detalle de estas.
 *
 * @author Francisco Riveros.
 */
.controller('detalleSugerenciaController', [
	'$scope',
	'sugerenciaResource',
	function($scope, sugerenciaResource) {
		$scope.open = true;

		/**
		 * Verifica si es posible ingresar la respuesta a la sugerencia
		 *
		 * @return TRUE de ser posible, FALSE en caso contrario.
		 */
		$scope.esPosibleIngresar = function() {

			if(angular.isUndefined($scope.respuestaSugerenciaForm)) {
				return false;
			} else {				
				return $scope.respuestaSugerenciaForm.$valid;
			}
		};

		/**
		 * Envía la respuesta del administrador asociada a una sugerencia 
		 * de usuario.		 
		 */
		$scope.responder = function() {
			$scope.sugerencia.respondida 	= true;
			$scope.sugerencia.respuesta 	= {
				detalle : $scope.respuesta,
				usuario : { 
					id_usuario 	: $scope.admin._id,
					nombre 		: $scope.admin.nombre,
					photo 		: $scope.admin.photo
				},
				fecha 	: Date.now()
			};

			sugerenciaResource.actualizar($scope.sugerencia._id, $scope.sugerencia)
			.success(function(response) {
				$scope.$hide();
			});			
		};
	}
]);