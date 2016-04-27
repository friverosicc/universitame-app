"use strict";

angular.module('universitame-app.user.usuario', [
	'ui.router',
	'universitame-app.user.usuario.cuenta',
	'universitame-app.user.usuario.perfil'
])
.config(['$stateProvider', 
	function ($stateProvider) {	

	$stateProvider
	// Nueva cuentas de usuario
	.state('cuentaNueva', { 
		url 		: '/nueva-cuenta',
		views		: {
			'app-view' : {
				templateUrl : 'user/usuario/cuenta/cuenta-nueva.tpl.html',
				controller 	: 'cuentaNuevaController'
			}
		}		
	})
	// Detalle del perfil del usuario logeado
	.state('perfil', { 
		url 	: '/perfil/:id',
		views 	: {
			'app-view' : {
				templateUrl : 'user/usuario/perfil/perfil.tpl.html',
				controller 	: 'perfilController'
			},
			'app-header@perfil' : {
				templateUrl : 'user/common/header/header.tpl.html',
				controller 	: 'headerController'
			}			
		}
	});	
}]);