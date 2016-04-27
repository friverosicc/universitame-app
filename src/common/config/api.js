'use strict';

angular.module('config.api', [])
.factory('api', function() {
	return {
		url 				: 'http://api.universitame.com/v0/',
		// url					: 'http://127.0.0.1/v0/',
		urlFacebookLogin 	: 'http://api.universitame.com/auth/facebook'			
	};
});