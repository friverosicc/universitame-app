angular.module(	'universitame-app.session', [
	'ui.router',
	'session.infoUsuario',
	'resources.usuario'
])

.config(['$stateProvider', function ($stateProvider) {	

	$stateProvider
	.state('session', {
		url		: '/session?id&token&ts',
		views 	: {
			'app-view' : {
				controller 	: 'sessionController'
			}
		}		
	});
}])

/**
 * Controlador del estado sesión en donde se verifica la información
 * del usuario recién logeado.
 *
 * @author Francisco Riveros
 */
.controller('sessionController', [	
	'$state',
	'$stateParams',
	'infoUsuario',
	'usuarioResource',	
	function($state, $stateParams, infoUsuario, usuarioResource) {				
		var cookie = $stateParams;
		var _usuario = cookie;
		
		// Buscamos el detalle de la información del usuario
		usuarioResource.buscar(_usuario.id)
		.success(function(usuario) {
			if(usuario.ts == _usuario.ts) {	
				// Persistimos la información del usuario en el navegador
				infoUsuario.save(_usuario);		

				if(usuario.esta_registrado) {
					$state.go('home.preguntas');				
				} else {
					$state.go('registro');		
				}	
			} else {
				$state.go('login');
			}		
		})
		.error(function(response) {			
			$state.go('login');
		});	
	}
]);