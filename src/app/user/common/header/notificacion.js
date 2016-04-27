'use strict';

angular.module('universitame-app.user.common.header.notificacion', [
	'mgcrea.ngStrap.modal'
])

.controller('notificacionController', ['$scope', '$modal',
	function($scope, $modal) {		

		$scope.desplegarSugerencia = function(notificacion) {			
			var modalSugerencia = $modal({
				template 	: 'user/common/sugerencia/detalle-sugerencia.tpl.html',
				show 		: false,
				animation	: 'am-fade-and-scale',
				content 	: notificacion.id_sugerencia
			});

			$scope.$hide();			
			$scope.eliminarNotificacion(notificacion._id);
			modalSugerencia.$promise.then(modalSugerencia.show);
		};
	}
]);