'use strict';

angular.module('universitame-app.user.pregunta', [
	'ui.router',
	'universitame-app.user.pregunta.nuevaPregunta',
	'universitame-app.user.pregunta.detallePregunta',
	'universitame-app.user.common.header'
])
.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
		.state('detallePregunta', {
			url 	: '/preguntas/:idPregunta/:titulo',
			views 	: {
				// Vista del header
				'app-header@detallePregunta' : {
					templateUrl : 'user/common/header/header.tpl.html',
					controller 	: 'headerController'
				},
				'app-view' : {					
					templateUrl : 'user/pregunta/detalle-pregunta.tpl.html',
					controller : 'detallePreguntaController'
				},				
			}						
		});
	}
]);