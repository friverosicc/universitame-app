'use strict';

angular.module('universitame-app.user.common.menu', [
	'ui.router',
	'session.infoUsuario',	
	'resources.usuario'
])

/**
 * Controlador que administrar la vista del menú lateral del 
 * sistema.
 *
 * @author Francisco Riveros.
 */
.controller('menuController', [
	'$scope', 
	'$state',
	'infoUsuario', 
	'usuarioResource',	
	function($scope, $state, infoUsuario, usuarioResource) {

		var _usuario = infoUsuario.get();

		// Buscamos la foto y el nombre del usuario conectado.
		usuarioResource.buscar(_usuario.id)
		.success(function(usuario) {
			$scope.photo = usuario.photo;
			$scope.nombre = usuario.nombre;	
			$scope.id = usuario._id;
			$scope.showPhoto = angular.isDefined($scope.photo);			
		});		
	}
]);