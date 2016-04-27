'use strict';

angular.module('universitame-app.user.common.header', [
	'mgcrea.ngStrap.modal',
	'ui.router',
	'universitame-app.user.common.menu',	
	'universitame-app.user.common.header.notificacion',
	'universitame-app.user.common.sugerencia.detalle',
	'universitame-app.user.pregunta',
	'universitame-app.user.confesion',
	'universitame-app.user.home.filtro',
	'resources.notificacion'	
])

/**
 * Controlador de la vista del header de la aplicación.
 *
 * @author Francisco Riveros
 */
.controller('headerController', [
	'$scope', 
	'$timeout',
	'$filter',
	'$modal', 
	'$state', 
	'$stateParams',
	'$location',
	'_',
	'notificacionResource',
	'infoUsuario',
	function(	$scope, 
				$timeout, 
				$filter, 
				$modal, 
				$state, 
				$stateParams, 
				$location, 
				_, 
				notificacionResource,
				infoUsuario) {

		_verificarUsuarioConectado();		
		_cargarFiltroPorDefecto();

		$scope.cantidadNotificaciones = 0;
		$scope.notificaciones = [];

		var _modalPregunta = $modal({ 
			template 	: 'user/pregunta/nueva-pregunta.tpl.html', 
			show 		: false,
	   		animation 	: 'am-fade-and-scale'
		});

		var _modalConfesion = $modal({
			template 	: "user/confesion/nueva-confesion.tpl.html",
			show 		: false,
			animation 	: 'am-fade-and-scale'
		});
			
		// Nos ponemos a la escucha del cambio de URL
		$scope.$on('$locationChangeSuccess', function (event, newLoc, oldLoc){			
			_cargarFiltroPorDefecto();
		});	

		/**
		 * Verificamos si existe un usuario conectado al sistema
		 * para decidir si buscar notificaciones o no.
		 */
		function _verificarUsuarioConectado() {			
			if(angular.isDefined(infoUsuario.get())) {
				$scope.usuarioConectado = true;
				_cargarNotificaciones();
			} else {
				$scope.usuarioConectado = false;
			}
		}

		/**
		 * Función que busca constantemente si existen notificaciones para
		 * el usuario que se encuentra logeado en el sistema.		 
		 */
		function _cargarNotificaciones() {
			notificacionResource.buscar()
			.then(function(response) {				
				if(response.status === 200) {
					$scope.cantidadNotificaciones = response.data.length;

					// Agregamos al listado de notificaciones las nuevas que devuelve el servidor
					angular.forEach(response.data, function(notificacion) {
						var tmp = $filter('filter')($scope.notificaciones, { _id : notificacion._id });

						if(_.isEmpty(tmp)) {
							$scope.notificaciones.unshift(notificacion);
						}
					});	

					// Eliminamos del listado de notificaciones las que ya no se encuentran en el servidor.
					angular.forEach($scope.notificaciones, function(notificacion) {
						var tmp = $filter('filter')(response.data, { _id : notificacion._id });

						if(_.isEmpty(tmp)) {
							$scope.notificaciones = $filter('filter')($scope.notificaciones, { _id : '!'+notifacion._id });
						}
					});						
				} else {
					$scope.cantidadNotificaciones = 0;
					$scope.notificaciones = [];
				}

				var promise = $timeout(_cargarNotificaciones, 8000);

				// Quedamos a la escucha de la destrucción del $scope, 
				// para cancelar la búsqueda de notificaciones.
				$scope.$on('$destroy', function() {
					$timeout.cancel(promise);
				});
			});
		}

		/**
		 * Extrae el parámetro de búsqueda de la URL y lo guarda en el $scope.
		 */
		function _cargarFiltroPorDefecto() {			
			$scope.textoBusqueda = $location.search().text;
		}	

		/**
		 * Despliega el modal para ingresar una nueva pregunta.
		 */
		$scope.showNuevaPregunta = function() {
			_modalPregunta.$promise.then(_modalPregunta.show);
		};

		/**
		 * Despliega el modal para ingresar una nueva confesión.
		 */
		$scope.showNuevaConfesion = function() {
			_modalConfesion.$promise.then(_modalConfesion.show);
		};		

		/**
		 * Cierra el modal de pregunta cuando se lanza el evento 
		 * "cerrarModalPregunta"
		 */
		$scope.$on('cerrarModalPregunta', function() {
			_modalPregunta.$promise.then(_modalPregunta.hide);			
		});

		/**
		 * Cierra el modal de confesión cuando se lanza el evento
		 * "cerrarModalConfesion"
		 */
		$scope.$on('cerrarModalConfesion', function() {
			_modalConfesion.$promise.then(_modalConfesion.hide);			
		});

		/**
		 * Elimina una notificación desde el listado de notificaciones
		 * tanto en el backen como en la vista.
		 */
		$scope.eliminarNotificacion = function(idNotificacion) {
			notificacionResource.eliminar(idNotificacion)
			.then(function(response) {
				var id = '!'+idNotificacion;
				$scope.notificaciones = $filter('filter')($scope.notificaciones, { _id : id });
				$scope.cantidadNotificaciones -= 1;
			});
		};

		/**
		 * Busca todas las publicaciones y redirige a la vista "Todo"
		 */
		$scope.buscarPublicaciones = function() {			
			var params = {
				text : $scope.textoBusqueda
			};

			$state.go('home.todos', params);
		};
	}
]);
