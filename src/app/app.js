'use strict';

angular.module('universitame-app', [
	'ngAnimate',
	'security.interceptor',
	'ui.router',
	'angularMoment',
	'mgcrea.ngStrap',	
	'monospaced.elastic',
	'infinite-scroll',
	'timer',
	'underscore',
	'universitame-tpl',
	'universitame-app.admin',
	'universitame-app.session',
	'universitame-app.login',
	'universitame-app.logout',
	'universitame-app.user'	
])
.config(['$urlRouterProvider', '$stateProvider', '$locationProvider', '$httpProvider', 
	function ($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider) {
		$locationProvider.html5Mode({
			enabled 	: true, 
			requireBase : false
		});				
		
		$urlRouterProvider.otherwise('404');		

		$stateProvider
		.state('landing', { 
			url : '/',
			views 	: {				
				// Vista del contenido
				'app-view' : {
					templateUrl : 'landing/landing.tpl.html'
				}
			}
		});
	}
])
.run(function() {
	FastClick.attach(document.body);
})
.controller('appController', ['$scope', '$window', function($scope, $window) {
	$scope.goBack = function() {
		$window.history.back();
	};
}]);

/**
 * Let's you use underscore as a service from a controller.
 * Got the idea from: http://stackoverflow.com/questions/14968297/use-underscore-inside-controllers
 * @author: Andres Aguilar https://github.com/andresesfm
 */
angular.module('underscore', []).factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});
