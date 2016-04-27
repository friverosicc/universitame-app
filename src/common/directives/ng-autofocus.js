angular.module('directives.ngAutofocus', [])
.directive('ngAutofocus', function($timeout) {
	return {
		scope: { trigger: '@ngAutofocus' },
		link: function(scope, element) {			
			scope.$watch('trigger', function(value) {					
				if(value === 'true') {  	
					element[0].focus();						
				}
			});
		}
	};
});
