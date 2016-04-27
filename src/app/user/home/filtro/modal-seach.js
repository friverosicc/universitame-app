angular.module('universitame-app.user.home.filtro', [
	'resources.instituciones',
	'resources.carreras'
])

/**
 * Controlador de la vista del filtro de búsqueda que es desplegado
 * en los dispositivos móviles.
 *
 * @author Francisco Riveros.
 */
.controller('modalSearchController', [
	'$scope',
	'$state',
	'$location',
	'institucionesResource',
	'carrerasResource',
	function($scope, $state, $location, institucionesResource, carrerasResource) {

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

		$scope.buscarPublicaciones = function (institucion, carrera, texto) {				
			var params = {};			

			if(angular.isDefined(institucion)) {
				params.idi = institucion._id;
				params.ndi = institucion.nombre;
			}
			
			if(angular.isDefined(carrera)) {
				params.idc = carrera._id;
				params.ndc = carrera.nombre;
			}

			if(angular.isDefined(texto)) {
				params.text = texto;
			}
			
			$state.go('home.todos', params);
		};
	}
]);