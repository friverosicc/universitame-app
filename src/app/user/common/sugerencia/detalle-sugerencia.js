'use strict';

angular.module('universitame-app.user.common.sugerencia.detalle', [
	'resources.sugerencia'	
])

.controller('detalleSugerenciaUserController', [
	'$scope', 
	'sugerenciaResource',
	function($scope, sugerenciaResource) {		

		sugerenciaResource.buscarUno($scope.content)
		.success(function(sugerencia) {
			$scope.sugerencia = sugerencia;
		});

	}
]);