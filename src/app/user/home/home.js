'use strict';

angular.module('universitame-app.user.home', [	
	'ngAnimate',
	'ngSanitize',	
	'mgcrea.ngStrap.modal',
	'mgcrea.ngStrap.aside',
	'mgcrea.ngStrap.typeahead',		
	'universitame-app.user.common.header',
	'universitame-app.user.home.listadoTodos',
	'resources.instituciones',
	'resources.carreras'
])
.config(['$stateProvider', function ($stateProvider) {	

	$stateProvider
	.state('home', { 		
		views 	: {
			// Vista del header
			'app-header@home' : {
				templateUrl : 'user/common/header/header.tpl.html',
				controller 	: 'headerController'
			},

			// Vista del contenido
			'app-view' : {
				templateUrl : 'user/home/home.tpl.html',
				controller 	: 'homeController'
			}						
		}
	})
	.state('home.preguntas', {
		url 	: '/preguntas?ordenar&filtrar&&idi&ndi&idc&ndc&text',
		views 	: {
			// Vista del listado de preguntas
			'app-list@home' : {
				templateUrl : 'user/pregunta/listado-preguntas.tpl.html',				
				controller 	: 'listadoTodosController'	

			}
		}
	})	
	.state('home.confesiones', {
		url : '/confesiones?ordenar&filtrar&&idi&ndi&idc&ndc&text',
		views 	: {
			// Vista del listado de confesiones
			'app-list@home' : {
				templateUrl : 'user/confesion/listado-confesiones.tpl.html',
				controller 	: 'listadoTodosController'	
			}
		}
	})
	.state('home.todos', {
		url : '/todo?ordenar&filtrar&idi&ndi&idc&ndc&text',
		views 	: {
			// Vista del listado de preguntas y confesiones
			'app-list@home' : {
				templateUrl : 'user/home/listado-todos.tpl.html',
				controller 	: 'listadoTodosController'		
			}
		}
	});	
}])

/**
 * Controlador de la vista principal de la aplicación en la que se despliegan
 * los listados de Preguntas, Confesiones y la combinación de ambas. Más especificamente
 * este controlador se encarga de administrar el formulario de búsqueda por 
 * Universidad y Carreras:
 *
 * @author Francisco Riveros.
 */
.controller('homeController', [
	'$scope', 
	'$state',
	'$location',
	'institucionesResource',
	'carrerasResource',
	function($scope, $state, $location, institucionesResource, carrerasResource) {		
		$scope.mostrarFiltro = false;
		_cargarFiltroPorDefecto();

		// Nos ponemos a la escucha del cambio de URL
		$scope.$on('$locationChangeSuccess', function (event, newLoc, oldLoc){
			_cargarFiltroPorDefecto();	
		});

		/**
		 * Función responsable de cargar los campos que estan establecidos
		 * para el filtro.
		 */
		function _cargarFiltroPorDefecto() {			
			var params = $location.search();
			$scope.institucion = {
				_id 	: params.idi,
				nombre 	: params.ndi
			};

			$scope.carrera = {
				_id 	: params.idc,
				nombre 	: params.ndc
			};			

			$scope.text = params.text;
		}

		/**
		 * Busca las instituciones que coinciden con el nombre pasado
		 * como parámetro.
		 */
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

		/**
		 * Busca las carreras que coindicen con el nombre pasado
		 * como parámetro y la institución si es que esta seleccionada.
		 */
		$scope.buscarCarreras = function(nombre) {					
			var params = { nombre : nombre };
			
			if(angular.isDefined($scope.institucion)) {
				params.codigoInstitucion = $scope.institucion._id;
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

		/**
		 * Busca todas las publicaciones Preguntas o Confesiones, que coincidan
		 * con los parámetros de búsqueda.
		 */
		$scope.buscarPublicaciones = function (institucion, carrera, text) {			
			var params = {};			

			if(angular.isDefined(institucion)) {
				params.idi = institucion._id;
				params.ndi = institucion.nombre;
			}
			
			if(angular.isDefined(carrera)) {
				params.idc = carrera._id;
				params.ndc = carrera.nombre;
			}

			if(angular.isDefined(text)) {
				params.text = text;
			}
			
			$scope.mostrarFiltro = false;
			$state.go($state.current.name, params);
		};
	}
]);
