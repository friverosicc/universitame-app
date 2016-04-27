'use strict';

angular.module('universitame-app.user.confesion', [
	'universitame-app.user.confesion.nuevaConfesion',
	'universitame-app.user.confesion.detalleConfesion'
])
.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
		.state('detalleConfesion', {
			url 	: '/confesiones/:idConfesion',
			views 	: {
				// Vista del header
				'app-header@detalleConfesion' : {
					templateUrl : 'user/common/header/header.tpl.html',
					controller 	: 'headerController'
				},
				'app-view' : {					
					templateUrl : 'user/confesion/detalle-confesion.tpl.html',
					controller : 'detalleConfesionController'
				},				
			}						
		});
	}
]);