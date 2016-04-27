'use strict';

angular.module('universitame-app.user.common.not-found-404', [
	'ui.router'
]).config(['$stateProvider', function ($stateProvider) {	

	$stateProvider
	.state('404', {
		url : '/404',
		views 	: {
			// Vista del contenido
			'app-view' : {
				templateUrl : 'user/common/not-found-404.tpl.html'
			}	
		}
	});	
}])