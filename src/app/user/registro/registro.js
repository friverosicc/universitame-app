'use strict';

angular.module(	'universitame-app.user.registro', [
	'ngSanitize',
	'ui.router',	
	'ui.select',
	'session.infoUsuario',
	'resources.paises',
	'resources.ciudades',
	'resources.instituciones',
	'resources.carreras',
	'resources.usuario'
])

.config(['$stateProvider', function ($stateProvider) {	

	$stateProvider
	.state('registro', { 
		url 	: '/registro',
		views 	: {
			'app-view' : {
				templateUrl : 'user/registro/registro.tpl.html',
				controller	: 'registroUsuarioController'
			}	
		}
		
	});
}])

.controller('registroUsuarioController', [
	'$scope', 
	'$http',
	'$state',
	'infoUsuario',
	'paisesResource',
	'ciudadesResource',
	'institucionesResource',
	'carrerasResource',
	'usuarioResource',
	function(	$scope, 
				$http, 
				$state, 
				infoUsuario,
				paisesResource, 				
				ciudadesResource, 
				institucionesResource,
				carrerasResource,
				usuarioResource) {		
				
		var cargaInicial 		= true;
		$scope.stepSelected 	= 0;
		$scope.usuario 			= infoUsuario.get();
		$scope.paises 			= [];
		$scope.ciudades 		= [];
		$scope.instituciones 	= [];
		$scope.carreras 		= [];		

		// Si no se encuentra un usuario logeado, redirigimos la 
		// aplicación a la vista de Login.
		if(angular.isUndefined($scope.usuario)) {
			$state.go('login');
		}
			
		paisesResource.buscar()
		.success(function(paises) {
			$scope.paises = paises;
		});

		// Buscamos la información del perfil del usuario.
		usuarioResource.buscar($scope.usuario.id)
		.success(function(usuario) {
			$scope.usuario = usuario;			
			if(angular.isDefined(usuario.pais)) {
				$scope.usuario.pais._id = usuario.pais.id_pais;
			}
			if(angular.isDefined(usuario.ciudad)) {
				$scope.usuario.ciudad._id = usuario.ciudad.id_ciudad;
			}
			if(angular.isDefined(usuario.carrera)) {
				$scope.usuario.carrera._id = usuario.carrera.id_carrera;
			}
			if(angular.isDefined(usuario.institucion)){
				$scope.usuario.institucion._id = usuario.institucion.id_institucion;
			}
			$scope.usuario.sexo = usuario.id_sexo;		
			$scope.usuario.tipo_usuario = usuario.id_tipo_usuario;

			if($scope.usuario.esta_registrado) {
				$state.go('home.todos');
			}
		});

		$scope.setStep = function(stepSelected) {
			$scope.stepSelected = stepSelected;
		};

		$scope.setSexo = function(sexo) {
			$scope.usuario.sexo = sexo;			
			$scope.stepSelected++;
		};

		$scope.setTipoUsuario = function(tipoUsuario) {
			$scope.usuario.tipo_usuario = tipoUsuario;
			$scope.stepSelected++;
		};

		/**
		 * Guarda toda la información del nuevo usuario del 
		 * sistema en el servidor, terminando el proceso de registro.
		 */
		$scope.finalizarRegistro = function() {				
			usuarioResource.actualizar($scope.usuario).
			success(function(data) {				
				$state.go('home.todos');
			}).
			error(function(data) {});
			
		}		

		// Buscamos el listado de las ciudades deacuerdo al
		// País seleccionado.
		$scope.$watch('usuario.pais', function(pais) {
			if(angular.isDefined(pais)) {				
				if(!cargaInicial) {		
					$scope.usuario.ciudad 		= undefined;
					$scope.usuario.institucion 	= undefined;
					$scope.usuario.carrera 		= undefined;
					$scope.ciudades 			= [];
					$scope.instituciones 		= [];
					$scope.carreras 			= [];						
				}											
					
			}
		});

		$scope.$watch('usuario.institucion', function(institucion) {						
			if(!angular.isUndefined(institucion)) {			
				if(cargaInicial) {														
					cargaInicial = false;					
				}								
			} else {
				$scope.usuario.carrera = undefined;
				$scope.carreras = [];
			}
		});


		$scope.buscarCiudades = function(nombre) {

			if(angular.isUndefined($scope.usuario.pais)) {
				return [];
			}

			var params = {
				codigoPais 	: $scope.usuario.pais._id,
				nombre 		: nombre
			};
			ciudadesResource.buscar(params)
			.then(function(response) {
				$scope.ciudades = response.data;
			});			
		};

		$scope.buscarInstituciones = function(nombre) {
			if(angular.isUndefined($scope.usuario.pais)) {
				return [];
			}

			var params = {
				codigoPais 	: $scope.usuario.pais._id,
				nombre 		: nombre
			};

			// Obtenemos las instituciones
			institucionesResource.buscar(params)
			.success(function(instituciones) {					
				$scope.instituciones = instituciones;
			});	
		};

		$scope.buscarCarreras = function(nombre) {		
			if(angular.isUndefined($scope.usuario.institucion)) {
				return [];
			}

			var params = {
				codigoInstitucion 	: $scope.usuario.institucion._id,
				nombre 				: nombre	
			};

			// Obtenemos las carreras
			carrerasResource.buscar(params)
			.success(function(carreras) {
				$scope.carreras = carreras;
			});
		};
	}
]);