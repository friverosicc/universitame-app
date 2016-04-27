'use strict';

angular.module('universitame-app.user.home.listadoTodos', [
	'infinite-scroll',
	'resources.publicacion',
	'session.infoUsuario',
	'mgcrea.ngStrap.alert',
	'universitame-app.user.usuario.modal-perfil'
])

/**
 * Controlador de la vista en donde se despliega el listado 
 * tanto de preguntas y confesiones mescladas.
 *
 * @author Francisco Riveros.
 */
.controller('listadoTodosController', [
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

		var _inicio = 0;
		var _total  = 10;
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

		var _msgExito = { 
			title 		: 'Éxito',
			template 	: 'user/common/exito/exito.tpl.html',					
			show 		: true,
			animation 	: 'am-fade',
			placement 	: 'top-right',
			container 	: 'body',					
			content 	: '',
			duration 	: 3,
			type 		: 'info'
		};		

		var _publicacionEliminar = undefined;

		$scope.sinContenido 			= false;
		$scope.cargandoPublicaciones 	= false;
		$scope.publicaciones 			= [];			

		// Buscamos la información del usuario conectado.
		if(angular.isDefined(infoUsuario.get())) {
			$scope.usuario = { id : infoUsuario.get().id };
		} else {
			$scope.usuario = undefined;
		}		

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
		 * Cambia al estado de detalle de la pregunta
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
		 * Cambia al estado de detalle de la confesión
		 * 
		 * @param idConfesion Código de la confesión		 
		 */
		$scope.irDetalleConfesion = function(idConfesion) {			
			$state.go('detalleConfesion', { 
				idConfesion : idConfesion
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

				_msgExito.content = 'La publicación ha sido eliminada satisfactoriamente';
				$alert(_msgExito);

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
			var tipoPublicacion = undefined;

			// Integración con el estado perfil
			var idUsuario 		= $scope.idUsuarioPerfil;

			// Integración con el estado home.preguntas
			if($state.current.name === 'home.preguntas') {
				tipoPublicacion = 'P';
			}

			// Integración con el estado home.preguntas
			if($state.current.name === 'home.confesiones') {
				tipoPublicacion = 'C';
			}			

			var params = {};
			params.ordenar 			= $stateParams.ordenar;
			params.filtrar 			= $stateParams.filtrar;
			params.idInstitucion 	= $stateParams.idi;
			params.idCarrera 		= $stateParams.idc;	
			params.text 			= $stateParams.text;		
			params.tipoPublicacion	= tipoPublicacion;
			params.idUsuario 		= idUsuario; 
			
			_construirTextoResultados();

			if(_inicio <= _total) {
				if(!$scope.cargandoPublicaciones) {
					$scope.cargandoPublicaciones = true;
				
					publicacionResource.buscar(_inicio, params)
					.then(function(response) {	
						if(response.status === 200) {							
							$scope.publicaciones = $scope.publicaciones.concat(response.data.publicaciones);
							
							_total = response.data.cantidad;
							_inicio += 10;
						}

						if(response.status === 204 && _inicio === 0) {
							$scope.sinContenido = true;
						}

						$scope.cargandoPublicaciones = false;
					});
				}		
			}
		};

		function _construirTextoResultados() {
			var cantidadCampos = 0;
			var campos = [];

			if(angular.isDefined($stateParams.ndi)) {
				campos.push($stateParams.ndi);
			}

			if(angular.isDefined($stateParams.ndc)) {
				campos.push($stateParams.ndc);
			}

			if(angular.isDefined($stateParams.text)) {
				campos.push($stateParams.text);
			}

			if(campos.length > 0) {
				$scope.camposFiltro = 'Resultados para '; 	
			}
			angular.forEach(campos, function(campo, indice) {
				if(indice > 0 && indice < campos.length-1) {
					$scope.camposFiltro += ', ';
				} else {
					if(indice > 0) {
						$scope.camposFiltro += ' y ';
					}
				}

				$scope.camposFiltro += '<strong>' + campo + '</strong>';
			});			
		}

		/**
		 * Busca la información de la nueva pregunta creada y la 
		 * añade al listado que se esta visualizando, todo esto 
		 * cuando se lanza el evento "cerrarModalPregunta"
		 */
		$scope.$on('cerrarModalPregunta', function(event, idPregunta) {		
			_msgExito.content = 'La pregunta ha sido ingresada satisfactoriamente';
			$alert(_msgExito);

			publicacionResource.buscarUno(idPregunta)
			.then(function(response) {
				$scope.publicaciones.unshift(response.data);
			});			
		});			

		/**
		 * Busca la información de la nueva confesión creada y la 
		 * añade al listado que se esta visualizando, todo esto 
		 * cuando se lanza el evento "cerrarModalConfesion"
		 */
		$scope.$on('cerrarModalConfesion', function(event, idPregunta) {			
			_msgExito.content = 'La confesión ha sido ingresada satisfactoriamente';
			$alert(_msgExito);

			publicacionResource.buscarUno(idPregunta)
			.then(function(response) {
				$scope.publicaciones.unshift(response.data);
			});			
		});	

		$scope.extractoConfesion = function (texto) {
			if(texto.length > 200) {
				return texto.substring(0, 199) + ' ...';
			}

			return texto;
		};
	}
]);