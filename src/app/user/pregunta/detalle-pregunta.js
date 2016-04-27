angular.module('universitame-app.user.pregunta.detallePregunta', [	
	'resources.publicacion',
	'resources.usuario',
	'session.infoUsuario',
	'resources.respuesta',
	'resources.comentario-respuesta',
	'filters.universitameLinky',
	'mgcrea.ngStrap.alert'
])

/**
 * Controlador de la vista del detalle de las preguntas.
 *
 * @author Francisco Riveros
 */
.controller('detallePreguntaController', [
	'$scope',
	'$stateParams', 
	'$filter',	
	'$alert',
	'$state',
	'publicacionResource',
	'usuarioResource',
	'infoUsuario',
	'respuestaResource',
	'comentarioRespuestaResource',	
	function(	$scope, 
				$stateParams, 
				$filter,
				$alert,	
				$state,	
				publicacionResource,
				usuarioResource,
				infoUsuario,
				respuestaResource,
				comentarioRespuestaResource) {	

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

		var _msgExito = $alert({ 
					title 		: 'Éxito',
					content 	: 'La pregunta ha sido eliminada satisfactoriamente',
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
			publicacionResource.buscarUno($stateParams.idPregunta, idUsuario)
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

			respuestaResource.buscar($stateParams.idPregunta, idUsuario)
			.then(function(response) { // Buscamos la información de los comentarios de las respuestas.
				$scope.respuestas = response.data;

				angular.forEach($scope.respuestas, function(respuesta) { 
					respuesta.inicio = 0;
					respuesta.comentarios = [];

					$scope.buscarMasComentarios(respuesta);				
				});			
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

		$scope.mostrarNuevoComentario = function(comentarios) {
			if(angular.isUndefined(comentarios)) {
				return true;
			}
			return (comentarios.length === 0);
		};

		$scope.mostrarMasComentarios = function(respuesta) {
			return !(respuesta.inicio <= respuesta.cantidad);
		};

		/**
		 * Verifica que si es posible publicar una respuesta.		 
		 */
		$scope.esPosibleResponder = function() {
			return $scope.respuestaForm.$valid;
		};

		/**
		 * Enviamos la respuesta al servidor.
		 */
		$scope.responder = function() {
			var respuesta = {				
				respuesta 	: $scope.respuesta,
				fecha 		: Date.now()
			};
						
			respuestaResource.crear($stateParams.idPregunta, respuesta)
			.then(function(response) { 				

				respuesta.usuario = $scope.usuario;
				respuesta.usuario.id_usuario = $scope.usuario._id;
				respuesta.ranking = 0;
				respuesta._id = response.data._id;
				respuesta.comentarios = [];

				$scope.respuestas.push(respuesta);
				$scope.respuesta = '';
			});
		};

		/**
		 * Elimina una respuesta asociada a una pregunta.
		 *
		 * @param respuesta Objeto con la información de la respuesta a
		 * eliminar.
		 */
		$scope.eliminarRespuesta = function(respuesta) {
			respuesta.eliminando = true;

			respuestaResource.eliminar($stateParams.idPregunta, respuesta._id)
			.then(function(response) {
				var id = '!'+respuesta._id;
				$scope.respuestas = $filter('filter')($scope.respuestas, { _id : id });				
			})
			.catch(function() { respuesta.eliminando = false; });
			
		};

		/**
		 * Elimina la pregunta.
		 *
		 * @param pregunta Objeto con la información de la pregunta a
		 * eliminar.
		 */
		$scope.eliminarPublicacion = function() {
			$scope.publicacion.eliminando = true;

			if($scope.respuestas.length > 0) {
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
			publicacionResource.eliminar($stateParams.idPregunta)
			.then(function(response) {
				_msgExito.show();
				$state.go('home.todos');
			})
			.catch(function() { $scope.publicacion.eliminando = false; });
		}

		/**
		 * Cambia la evaluación que tiene una respuesta.
		 *
		 * @param respuesta Objeto con la información de la respuesta a evaluar.
		 * @param esPositiva TRUE en caso de que sea positiva, FALSE en caso contrario.
		 */
		$scope.evaluarRespuesta = function(respuesta, esPositiva) {	
			if($scope.usuarioConectado) {			
				if(esPositiva && respuesta.usuarioAprueba || !esPositiva && respuesta.usuarioReprueba) {
				
					respuestaResource.eliminarEvaluacion($stateParams.idPregunta, respuesta._id)
					.then(function(response) { 
						return respuestaResource.buscarUno(	$stateParams.idPregunta, 
															respuesta._id, 
															$scope.usuario._id);
					})
					.then(function(response) {
						_actualizarRanking(respuesta, response.data);
					});

				} else {
				
					respuestaResource.evaluar($stateParams.idPregunta, respuesta._id, esPositiva)
					.then(function(response) { 
						return respuestaResource.buscarUno(	$stateParams.idPregunta, 
															respuesta._id, 
															$scope.usuario._id);
					})
					.then(function(response) {
						_actualizarRanking(respuesta, response.data);
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
				
					publicacionResource.eliminarEvaluacion($stateParams.idPregunta, $scope.publicacion._id)
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
		 * Marca la respuesta como la mejor para una pregunta específica.
		 *
		 * @param respuesta Objeto con la información de la respuesta elegida como mejor.
		 */
		$scope.elegirMejorRespuesta = function(respuesta) {				
			if(respuesta.mejor_respuesta) {

				respuestaResource.eliminarMejorRespuesta($scope.publicacion._id, respuesta._id)	
				.then(function(response) {			
					respuesta.mejor_respuesta = false;
				});

			} else {

				var mejorRespuestaAnterior = $filter('filter')($scope.respuestas, { mejor_respuesta : true });

				respuestaResource.elegirMejorRespuesta($scope.publicacion._id, respuesta._id)
				.then(function(response) {			

					if(angular.isDefined(mejorRespuestaAnterior[0])) {
						mejorRespuestaAnterior[0].mejor_respuesta = false;
					}
					respuesta.mejor_respuesta = true;
				});
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

		$scope.enviarComentario = function(respuesta) {
			if(angular.isDefined(respuesta.nuevoComentario)) {
				if(respuesta.nuevoComentario.length > 0) {
					var comentario = {				
						comentario 	: respuesta.nuevoComentario,
						fecha 		: Date.now()
					};							
					
					comentarioRespuestaResource.crear(	$scope.publicacion._id, 
														respuesta._id, 
														comentario)
					.then(function(response) { 				
						comentario.usuario = $scope.usuario;
						comentario.usuario.id_usuario = $scope.usuario._id;
						comentario._id = response.data._id;

						respuesta.comentarios.push(comentario);
						respuesta.nuevoComentario = undefined;
					});

					respuesta.mostrarFormularioComentario =  false;
				}
			}			
		};	


		$scope.eliminarComentario = function(respuesta, comentario) {			
			comentarioRespuestaResource.eliminar(	$scope.publicacion._id,
													respuesta._id,
													comentario._id)
			.then(function(response) {
				var id = '!'+comentario._id;
				respuesta.comentarios = $filter('filter')(respuesta.comentarios, { _id : id });
			})
			.catch(function() { });
		};

		$scope.buscarMasComentarios = function(respuesta) {
			comentarioRespuestaResource.buscar(	$scope.publicacion._id, 
												respuesta._id,
												respuesta.inicio)
			.then(function(response) {	
				if(response.status === 200) {
					respuesta.inicio += 5;
					respuesta.cantidad = response.data.cantidad;
					respuesta.comentarios = respuesta.comentarios.concat(response.data.comentarios);
				} 
			});			
		};
	}
]);