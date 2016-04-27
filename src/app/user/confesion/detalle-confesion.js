angular.module('universitame-app.user.confesion.detalleConfesion', [	
	'resources.publicacion',
	'resources.usuario',
	'session.infoUsuario',
	'resources.comentario-publicacion',	
	'filters.universitameLinky',
	'mgcrea.ngStrap.alert'
])

/**
 * Controlador de la vista del detalle de las confesiones.
 *
 * @author Francisco Riveros
 */
.controller('detalleConfesionController', [
	'$scope',
	'$stateParams', 
	'$filter',	
	'$alert',
	'$state',
	'publicacionResource',
	'usuarioResource',
	'infoUsuario',
	'comentarioPublicacionResource',
	function(	$scope, 
				$stateParams, 
				$filter,
				$alert,	
				$state,	
				publicacionResource,
				usuarioResource,
				infoUsuario,				
				comentarioPublicacionResource) {	

		var _msgConfirmacion = $alert({ 
					title 		: 'Advertencia',
					content 	: '¿Esta seguro de eliminar la confesión?',
					template 	: 'user/common/confirmacion/confirmacion.tpl.html',					
					show 		: false,
					animation 	: 'am-fade',
					placement 	: 'top-right',
					container 	: '.container',
					type 		: 'confirm'
				});

		var _msgExito = $alert({ 
			title 		: 'Éxito',
			content 	: 'La confesión ha sido eliminada satisfactoriamente',
			template 	: 'user/common/exito/exito.tpl.html',					
			show 		: false,
			animation 	: 'am-fade',
			placement 	: 'top-right',
			container 	: 'body',					
			duration 	: 3,
			type 		: 'info'
		});

		$scope.publicacion = { 
			tags 		: undefined, 
			usuario 	: { photo : '/img/img-profile-default.png' },
			eliminando 	: false
		};

		$scope.usuario = { photo : '/img/img-profile-default.png' };	
		$scope.existeContenido = true;

		_init();

		/**
		 * Busca la información detallada de la Confesión y del usuario 
		 * que puede estar conectado en el sistema.
		 */
		function _init() {
			var idUsuario = undefined;
			$scope.usuarioConectado = false;

			if(angular.isDefined(infoUsuario.get())) {
				idUsuario = infoUsuario.get().id;
				$scope.usuarioConectado = true;
			}

			// Buscamos la información de la publicación
			publicacionResource.buscarUno($stateParams.idConfesion, idUsuario)
			.then(function(response) {			
				if(response.status === 204) {
					$scope.existeContenido = false;
				}

				$scope.publicacion = response.data;
				$scope.publicacion.eliminando = false;		
			});				

			// Buscamos la información del usuario conectado.
			if($scope.usuarioConectado) {				
				usuarioResource.buscar(idUsuario)
				.then(function(response) {  // Buscamos la información de las respuestas				
					$scope.usuario = response.data; 	

					if(angular.isUndefined($scope.usuario.photo)) {
						$scope.usuario.photo = '/img/img-profile-default.png';
					}				
				});
			} else {
				$scope.usuario = undefined;
			}

			comentarioPublicacionResource.buscar($stateParams.idConfesion, idUsuario)
			.then(function(response) { 
				$scope.comentarios = response.data;
			});
		}		
		
		/**
		 * Verifica si una publicación posee tags para mostrar.
		 *
		 * @param publicacion Objeto con la informaación del al publicación
		 * @return TRUE si la publicación posee tags, FALSE en caso contrario.
		 */
		$scope.mostrarTags = function(publicacion) {
			return 	($scope.mostrarCarrera(publicacion.carrera) 
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
		 * Verifica que si es posible publicar un comentario.		 
		 */
		$scope.esPosibleComentar = function() {
			return $scope.comentarioForm.$valid;
		};

		/**
		 * Enviamos el comentario al servidor.
		 */
		$scope.comentar = function() {
			var comentario = {				
				comentario 	: $scope.comentario,
				fecha 		: Date.now()
			};
						
			comentarioPublicacionResource.crear($stateParams.idConfesion, comentario)
			.then(function(response) { 				

				comentario.usuario = $scope.usuario;
				comentario.usuario.id_usuario = $scope.usuario._id;
				comentario.ranking = 0;
				comentario._id = response.data._id;				

				$scope.comentarios.push(comentario);
				$scope.comentario = '';
			});
		};

		/**
		 * Elimina un comentario asociada a una publicación.
		 *
		 * @param comentario Objeto con la información del comentario a
		 * eliminar.
		 */
		$scope.eliminarComentario = function(comentario) {
			comentario.eliminando = true;

			comentarioPublicacionResource.eliminar($stateParams.idConfesion, comentario._id)
			.then(function(response) {
				var id = '!'+comentario._id;
				$scope.comentarios = $filter('filter')($scope.comentarios, { _id : id });				
			})
			.catch(function() { comentario.eliminando = false; });
			
		};

		/**
		 * Elimina la publicación.
		 *
		 * @param publicacion Objeto con la información de la publicación a
		 * eliminar.
		 */
		$scope.eliminarPublicacion = function() {
			$scope.publicacion.eliminando = true;

			if($scope.comentarios.length > 0) {
				_msgConfirmacion.show();
			} else {
				_eliminarPublicacion();
			}			
		};		

		$scope.$on('cancelarOperacion', function() {
			_msgConfirmacion.hide();
			$scope.publicacion.eliminando = false;
		});

		$scope.$on('aprobarOperacion', function() {
			_msgConfirmacion.hide();
			_eliminarPublicacion();
			
		});

		function _eliminarPublicacion() {
			publicacionResource.eliminar($stateParams.idConfesion)
			.then(function(response) {
				$state.go('home.todos');
			})
			.catch(function() { $scope.publicacion.eliminando = false; });
		}

		/**
		 * Cambia la evaluación que tiene un comentario.
		 *
		 * @param comentario Objeto con la información del comentario a evaluar.
		 * @param esPositiva TRUE en caso de que sea positiva, FALSE en caso contrario.
		 */
		$scope.evaluarComentario = function(comentario, esPositiva) {
			if($scope.usuarioConectado) {	
				if(esPositiva && comentario.usuarioAprueba || !esPositiva && comentario.usuarioReprueba) {
				
					comentarioPublicacionResource.eliminarEvaluacion($stateParams.idConfesion, comentario._id)
					.then(function(response) { 
						return comentarioPublicacionResource.buscarUno(	$stateParams.idConfesion, 
																		comentario._id, 
																		$scope.usuario._id);
					})
					.then(function(response) {
						_actualizarRanking(comentario, response.data);
					});

				} else {
				
					comentarioPublicacionResource.evaluar($stateParams.idConfesion, comentario._id, esPositiva)
					.then(function(response) { 
						return comentarioPublicacionResource.buscarUno(	$stateParams.idConfesion, 
																		comentario._id, 
																		$scope.usuario._id);
					})
					.then(function(response) {
						_actualizarRanking(comentario, response.data);
					});	
				}
			}
		};

		/**
		 * Cambia la evaluación que tiene una publicación.
		 *		 
		 * @param esPositiva TRUE en caso de que sea positiva, FALSE en caso contrario.
		 */
		$scope.evaluarPublicacion = function(esPositiva) {	
			if($scope.usuarioConectado) {			
				if(esPositiva && $scope.publicacion.usuarioAprueba || !esPositiva && $scope.publicacion.usuarioReprueba) {
				
					publicacionResource.eliminarEvaluacion($stateParams.idConfesion, $scope.publicacion._id)
					.then(function(response) { 
						return publicacionResource.buscarUno(	$scope.publicacion._id, 														
																$scope.usuario._id);
					})
					.then(function(response) {
						_actualizarRanking($scope.publicacion, response.data);
					});

				} else {
				
					publicacionResource.evaluar($scope.publicacion._id, esPositiva)
					.then(function(response) { 
						return publicacionResource.buscarUno(	$scope.publicacion._id, 
																$scope.usuario._id);
					})
					.then(function(response) {
						_actualizarRanking($scope.publicacion, response.data);
					});	
				}
			}
		};			

		/**
		 * Actualiza la información del ranking del objeto.
		 *
		 * @param objeto Objeto que se desea actualizar.
		 * @param nuevoObjeto Objeto del cual se actualizará la información.
		 */
		function _actualizarRanking(objeto, nuevoObjeto) {
			objeto.ranking = nuevoObjeto.ranking; 
			objeto.usuarioAprueba = nuevoObjeto.usuarioAprueba;
			objeto.usuarioReprueba = nuevoObjeto.usuarioReprueba;			
		}				
	}
]);