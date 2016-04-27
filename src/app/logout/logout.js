'use strinct';

angular.module('universitame-app.logout', [
	'ui.router',
	'session.infoUsuario'
])
.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('logout', { 
		url 		: '/logout',
		views 	: {
			'app-view' : {
				controller 	: 'logoutController'
			}
		}		
	});
}])

/**
 * Controlador encargado de administrar la URL de salida el sistema.
 *
 * @author Francisco Riveros.
 */
.controller('logoutController', [
	'$state', 
	'infoUsuario',
	function($state, infoUsuario) {		
		infoUsuario.remove();
		$state.transitionTo('landing');
	}
]);