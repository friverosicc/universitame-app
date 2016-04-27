'use strict';

angular.module('universitame-app.user.usuario.modal-perfil', [	
	'resources.usuario'
])

/**
 * Controlador de la vista del modal del perfil de usuario. 
 *
 * @author Francisco Riveros.
 */
.controller('modalPerfilController', [
	'$scope',	
	'usuarioResource',
	function($scope, usuarioResource) {	

		$scope.usuario = $scope.publicacion.usuario;

		if(angular.isDefined($scope.respuesta))
			$scope.usuario = $scope.respuesta.usuario;

		if(angular.isDefined($scope.comentario))
			$scope.usuario = $scope.comentario.usuario;

		usuarioResource.buscar($scope.usuario.id_usuario)
		.success(function(usuario) {
			$scope.usuario = usuario;		
		});
	}
]);