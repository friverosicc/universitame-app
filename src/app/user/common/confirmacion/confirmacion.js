'use strict';
angular.module('universitame-app.user.common.confirmacion', ['directives.ngAutofocus'])

.controller('confirmacionController', [
	'$rootScope',
	'$scope',	
	function($rootScope, $scope) {
		$scope.open = true;
		
		$scope.cancelar = function() {
			$rootScope.$broadcast('cancelarOperacion');

		};

		$scope.aceptar = function() {
			$rootScope.$broadcast('aprobarOperacion');
		};
	}
]);