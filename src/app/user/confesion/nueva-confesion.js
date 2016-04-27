'use strict';

angular.module('universitame-app.user.confesion.nuevaConfesion', [
	'resources.publicacion'
])

/**
 * Controlador del formulario de ingreso de confesiones.
 *
 * @author Francisco Riveros.
 */
.controller('nuevaConfesionController', [
	'$rootScope', 
	'$scope',
	'publicacionResource', 
	function($rootScope, $scope, publicacionResource) {

		$scope.open = true;
		$scope.publicacion = {};

		/**
		 * Publica la pregunta en la aplicación.
		 */
		$scope.publicar = function() {			
			$scope.publicacion.fecha = Date.now();
			$scope.publicacion.tipo = 'C';		

			publicacionResource.crear($scope.publicacion)
			.then(function(response) { 				
				$rootScope.$broadcast('cerrarModalConfesion', response.data.id_pregunta); 
			})
			.catch(function(response) { 
				$rootScope.$broadcast('cerrarModalConfesion', null); 
			});
		};


		/**
		 * Verifica si se ha ingresado la información mínima para
		 * crear una pregunta.
		 */
		$scope.sePuedePublicar = function() {
			if(angular.isUndefined($scope.nuevaConfesionForm)) {
				return false;
			} else {				
				return $scope.nuevaConfesionForm.$valid;
			}
		};	
	}
]);
