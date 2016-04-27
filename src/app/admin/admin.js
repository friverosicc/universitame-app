'use strict';

angular.module('universitame-app.admin', [
	'universitame-app.admin.sugerencia',
	'session.infoUsuario',
	'resources.usuario',
	'resources.sugerencia'
])
.config(['$stateProvider', function ($stateProvider) {	

	$stateProvider
	.state('admin', { 	
		views 	: {
			// Vista del header
			'app-header@admin' : {
				templateUrl : 'admin/common/header/header.tpl.html'
			},

			// Vista del contenido
			'app-view' : {
				templateUrl : 'admin/admin.tpl.html',
				controller 	: 'adminController'
			}	
		}
	})
	.state('admin.dashboard', {
		url 	: '/admin',
		views 	: {
			'app-list@admin' : {
				templateUrl	: 'admin/dashboard/dashboard.tpl.html'
			}
		}
	})
	.state('admin.sugerencias', {
		url 	: '/admin/sugerencias?filtrar',
		views 	: {
			'app-list@admin' : {
				templateUrl	: 'admin/sugerencia/sugerencia.tpl.html',
				controller 	: 'sugerenciaController'
			}
		}
	})
	.state('admin.usuarios', {
		url 	: '/admin/usuarios',
		views 	: {
			'app-list@admin' : {
				templateUrl	: 'admin/usuario/usuario.tpl.html'
			}
		}
	})
	.state('adminHome', {
		url 	: '/admin',
		views 	: {
			// Vista del header
			'app-header@admin' : {
				templateUrl : 'admin/common/header/header.tpl.html'
			},

			// Vista del contenido
			'app-view' : {
				templateUrl : 'home/home.tpl.html'
			}
		}
	});
}])
.controller('adminController', [
	'$scope', 
	'$state',
	'infoUsuario',
	'usuarioResource',
	'sugerenciaResource',
	function($scope, $state, infoUsuario, usuarioResource, sugerenciaResource) {

		// Buscamos la información del usuario administrador.
		usuarioResource.buscar(infoUsuario.get().id)
		.success(function(usuario) {

			// Verificamos que sea un usuario administrador
			if(angular.isDefined(usuario.es_administrador) && usuario.es_administrador === true) {
				$scope.admin = usuario;				
			} else {
				$state.go('home.todos');
			}
		});

		// Buscamos información de la cantidad de sugerencias ingresadas.
		sugerenciaResource.buscar({ inicio : 0, filtrar : 'sr' })
		.success(function(sugerencias) {
			$scope.cantidadSugerencias = sugerencias.cantidad;
		});
	}
]);