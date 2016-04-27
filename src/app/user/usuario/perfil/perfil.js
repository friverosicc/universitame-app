'use strict';

angular.module('universitame-app.user.usuario.perfil', [
	'session.infoUsuario',
	'resources.usuario',
	'resources.paises',
	'resources.ciudades',
	'resources.instituciones',
	'resources.carreras'
])

/**
 * Controlador de la vista de perfil de usuario. 
 *
 * @author Francisco Riveros.
 */
.controller('perfilController', [
	'$scope',
	'$stateParams',
	'infoUsuario', 
	'usuarioResource',
	'paisesResource',
	'ciudadesResource',
	'institucionesResource',
	'carrerasResource',
	function($scope, 
		$stateParams, 
		infoUsuario, 
		usuarioResource,
		paisesResource,
		ciudadesResource,
		institucionesResource,
		carrerasResource) {			

		var _usuario;
		$scope.usuarioSesion = infoUsuario.get();
		$scope.usuario = {};	
		$scope.editando = false;

		// Variable utilizada para la integración con el listado de publicaciones
		$scope.idUsuarioPerfil = $stateParams.id; 
		
		paisesResource.buscar()
		.success(function(paises) {
			$scope.paises = paises;
		});
		
		usuarioResource.buscar($stateParams.id)
		.success(function(usuario) {			
			angular.copy(usuario, $scope.usuario);
			_usuario = usuario;			
			$scope.mostrarFoto = angular.isDefined(usuario.photo);
			$scope.nombreUsuario = usuario.nombre;
		});

		/**
		 * Función que cambia el estado de la variable "editando"
		 * utilizada para mostrar u ocultar el formulario de edición.
		 */
		$scope.editar = function(editando) {			
			$scope.editando = editando;
			
			if(!editando) {
				angular.copy(_usuario, $scope.usuario);
			}
		};

		$scope.guardar = function() {			
			usuarioResource.actualizar($scope.usuario)
			.then(function(response) {
				$scope.editando = false;
			})
			.catch(function() {
				$scope.editando = false;
			});			
		}

		$scope.buscarInstituciones = function(nombre) {			
			return institucionesResource.buscar({ nombre : nombre })
			.then(function(response) {
				if(response.status === 200) {

					return response.data;
				} else {
					return [];
				}
			});					
		};

		$scope.buscarCarreras = function(nombre) {					
			var params = { nombre : nombre };
			
			if(angular.isDefined($scope.usuario.institucion)) {
				params.codigoInstitucion = $scope.usuario.institucion._id;
			}

			return carrerasResource.buscar(params)
			.then(function(response) {
				if(response.status === 200) {

					return response.data;
				} else {
					return [];
				}
			});			
		};		

		$scope.buscarCiudades = function(nombre) {

			if(	angular.isUndefined($scope.usuario.pais) || 
				angular.isObject(nombre)) {
				return [];
			}

			var params = {
				codigoPais 	: $scope.usuario.pais._id,
				nombre 		: nombre
			};

			return ciudadesResource.buscar(params)
			.then(function(response) {
				if(response.status === 200) {

					return response.data;
				} else {
					return [];
				}
			});			
		};		

		$scope.mostrarPublicacionConfesiones = function(tipo, idUsuario, idUsuarioSesion) {			
			return tipo === 'C' && idUsuario === idUsuarioSesion;
		}
	}
]);