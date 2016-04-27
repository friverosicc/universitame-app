'use strict';

angular.module('universitame-app.user.pregunta.nuevaPregunta', [
	'resources.instituciones',
	'resources.carreras',
	'resources.publicacion',
	'resources.usuario',
	'session.infoUsuario'
])

/**
 * Controlador del formulario de ingreso de nuevas preguntas
 *
 * @author Francisco Riveros
 */
.controller('nuevaPreguntaController', [
	'$rootScope',
	'$scope',
	'carrerasResource',
	'institucionesResource', 
	'publicacionResource',
	'usuarioResource',
	'infoUsuario',
	function(	$rootScope,
				$scope, 
				carrerasResource, 
				institucionesResource,
				publicacionResource,
				usuarioResource,
				infoUsuario) {

		$scope.open = true;
		$scope.publicacion = {};
		$scope.instituciones = [];
		$scope.carreras = [];		

		usuarioResource.buscar(infoUsuario.get().id)
		.success(function(usuario) { 
			$scope.usuario = usuario; 	
			$scope.showPhoto = angular.isDefined(usuario.photo);		
		});
		
		/**
		 * Busca en el servidor el listado de instituciones que
		 * coinciden con el nombre dado.
		 *
		 * @param nombre Nombre de la institución o parte de este.
		 */
		$scope.refrescarInstituciones = function(nombre) {
			if(nombre.length > 4) {
				institucionesResource.buscar({ nombre : nombre })
				.then(function(response) {
					$scope.instituciones = response.data;
				});
			}
		};

		/**
		 * Busca en el servidor el listado de carreras que
		 * coinciden con el nombre dado.
		 *
		 * @param nombre Nombre de la carrera o parte de este.
		 */
		$scope.refrescarCarreras = function(nombre) {				

			if(nombre.length > 4) {
				var params = {
					nombre  : nombre
				};

				if(angular.isDefined($scope.publicacion.institucion)) {
					params.codigoInstitucion = $scope.publicacion.institucion._id;
				}
				
				carrerasResource.buscar(params)
				.then(function(response) {
					$scope.carreras = response.data;
				});
			}
		};

		/**
		 * Publica la pregunta en la aplicación.
		 */
		$scope.publicar = function() {			
			$scope.publicacion.fecha = Date.now();
			$scope.publicacion.tipo = 'P';		

			publicacionResource.crear($scope.publicacion)
			.then(function(response) { 				
				$rootScope.$broadcast('cerrarModalPregunta', response.data.id_pregunta); 
			})
			.catch(function(response) { 
				$rootScope.$broadcast('cerrarModalPregunta', null); 
			});
		};

		/**
		 * Verifica si se ha ingresado la información mínima para
		 * crear una pregunta.
		 */
		$scope.sePuedePublicar = function() {
			if(angular.isUndefined($scope.nuevaPreguntaForm)) {
				return false;
			} else {				
				return $scope.nuevaPreguntaForm.$valid;
			}
		};				
	}
]);
