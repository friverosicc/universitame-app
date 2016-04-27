"use strict";

angular.module('universitame-app.user.hashtag', [
	'ui.router',
	'infinite-scroll',
	'resources.publicacion',
	'session.infoUsuario',
	'mgcrea.ngStrap.alert',
	'universitame-app.user.usuario.modal-perfil'
])
.config(['$stateProvider', 
	function ($stateProvider) {	

	$stateProvider
	// Nueva cuentas de usuario
	.state('hashtag', { 
		url 		: '/hashtag/:tag',		
		views 	: {
			'app-view' : {
				templateUrl : 'user/hashtag/hashtag.tpl.html',
				controller 	: 'hashtagController'
			},
			'app-header@hashtag' : {
				templateUrl : 'user/common/header/header.tpl.html',
				controller 	: 'headerController'
			}			
		}			
	});	
}])

.controller('hashtagController', [ 
	'$scope',
	'$state',	
	'$stateParams',
	'$filter',
	'$alert',
	'publicacionResource',	
	'infoUsuario', 	
	function(	$scope, 
				$state, 
				$stateParams, 
				$filter, 
				$alert, 				
				publicacionResource, 
				infoUsuario) {

		$scope.sinContenido = false;
		$scope.tag = '#' + $stateParams.tag;	

		var _inicio = 0;
		var _msgConfirmacion = $alert({ 
			title 		: 'Advertencia',
			content 	: '¿Esta seguro de eliminar la pregunta?',
			template 	: 'user/common/confirmacion/confirmacion.tpl.html',					
			show 		: false,
			animation 	: 'am-fade',
			placement 	: 'top-right',
			container 	: '.container',
			type 		: 'confirm'			
		});		

		var _publicacionEliminar = undefined;

		$scope.sinContenido 			= false;
		$scope.cargandoPublicaciones 	= false;
		$scope.publicaciones 			= [];			

		// Buscamos la información del usuario conectado.
		$scope.usuario = { id : infoUsuario.get().id };

		/**
		 * Verifica si una publicación posee tags para mostrar.
		 *
		 * @param publicacion Objeto con la informaación del al publicación
		 * @return TRUE si la publicación posee tags, FALSE en caso contrario.
		 */
		$scope.mostrarTags = function(publicacion) {			
			return 	((publicacion.tags.length > 0) 
					|| $scope.mostrarCarrera(publicacion.carrera) 
					|| $scope.mostrarInstitucion(publicacion.institucion));
		};

		/**
		 * Verifica si es posible mostrar la carrera.
		 *
		 * @param carrera Objeto con la información de la carrera.
		 * @return TRUE si la carrera no es 'undefined', 
		 * FALSE en caso contrario.
		 */
		$scope.mostrarCarrera = function(carrera) {
			return angular.isDefined(carrera);
		};

		/**
		 * Verifica si es posible mostrar la institución
		 *
		 * @param intitucion Objeto con la información de la institución.
		 * @return TRUE si la institución no es 'undefined', 
		 * FALSE en caso contrario. 
		 */
		$scope.mostrarInstitucion = function(institucion) {
			return angular.isDefined(institucion);
		};

		/**
		 * Cambia al estado de detalle de la publicación
		 * 
		 * @param idPregunta Código de la pregunta
		 * @param tituloURL Título en formato de URL
		 */
		$scope.irDetallePregunta = function(idPregunta, tituloURL) {			
			$state.go('detallePregunta', { 
				idPregunta 	: idPregunta, 
				titulo 		: tituloURL
			});
		};	

		/**
		 * Despliega el mensaje de confirmación de la eliminación de
		 * la publicación, para cuando esta tiene 1 o más respuestas 
		 * asociadas.
		 */
		$scope.confirmarEliminarPublicacion = function(publicacion) {
			_publicacionEliminar = publicacion;
			publicacion.eliminando = true;	

			if(publicacion.cantidad_respuestas > 0) {
				_msgConfirmacion.show();
			} else {
				_eliminarPublicacion();
			}
		};			

		/**
		 * Queda a la escucha del evento "cancelarOperacion" 
		 * que lanza la ventana de confirmación de operación.
		 */
		$scope.$on('cancelarOperacion', function() {
			_msgConfirmacion.hide();
			
			$filter('filter')($scope.publicaciones, { eliminando : true })[0].eliminando = false;
		});

		/**
		 * Queda a la escucha del evento "aprobarOperacion" 
		 * que lanza la ventana de confirmación de operación.
		 */
		$scope.$on('aprobarOperacion', function() {
			_msgConfirmacion.hide();
			_eliminarPublicacion();
			
		});

		/**
		 * Elimina la publicación del sistema haciendo uso de la 
		 * API del servidor.
		 */
		function _eliminarPublicacion() {
			publicacionResource.eliminar(_publicacionEliminar._id)
			.then(function(response) {

				var id = '!'+_publicacionEliminar._id;
				$scope.publicaciones = $filter('filter')($scope.publicaciones, { _id : id });				

				_publicacionEliminar = undefined;
			})
			.catch(function() { _publicacionEliminar.eliminando = false; });			
		}

		/**
		 * Busca las publicaciones del sistema
		 */
		$scope.buscarMasPublicaciones = function() {			
			var params = {
				text : $scope.tag
			};					

			if(!$scope.cargandoPublicaciones) {
				$scope.cargandoPublicaciones = true;

				publicacionResource.buscar(_inicio, params)
				.then(function(response) {	
					if(response.status === 200) {
						$scope.publicaciones = $scope.publicaciones.concat(response.data.publicaciones);
						
						_inicio += 5;
					}

					if(response.status === 204 && _inicio === 0) {
						$scope.sinContenido = true;
					}

					$scope.cargandoPublicaciones = false;
				});		
			}
		};	

		/**
		 * Busca la información de la nueva pregunta creada y la 
		 * añade al listado que se esta visualizando, todo esto 
		 * cuando se lanza el evento "cerrarModalPregunta"
		 */
		$scope.$on('cerrarModalPregunta', function(event, idPregunta) {			
			// Mostrar notificación de éxito.			
		});			

		/**
		 * Busca la información de la nueva confesión creada y la 
		 * añade al listado que se esta visualizando, todo esto 
		 * cuando se lanza el evento "cerrarModalConfesion"
		 */
		$scope.$on('cerrarModalConfesion', function(event, idPregunta) {			
			// Mostrar notificación de éxito.
		});	

		$scope.extractoConfesion = function (texto) {
			if(texto.length > 200) {
				return texto.substring(0, 199) + ' ...';
			}

			return texto;
		};	
	}
]);