'use strict';
angular.module('filters.universitameLinky', [])
/**
 * Filtro que convierte un #hastag o @perfil en urls hacia universitame.com
 */
.filter('universitameLinky', ['$filter', '$location',
	function($filter, $location) {
		return function(text, target) {
			if (!text) return text;

			var replacedText = $filter('linky')(text, target);

			var targetAttr = "";
			if (angular.isDefined(target)) {
				targetAttr = ' target="' + target + '"';
			}

			// replace #hashtags and send them to twitter
			var replacePattern1 = /(^|\s)#(\w*[a-zA-Z&#209;#241;&#225;&#233;&#237;&#243;&#250;&#193;&#201;&#205;&#211;&#218;_]+\w*)/gim;			
						
			replacedText = text.replace(replacePattern1, '$1<a href="http://'+$location.host()+':'+$location.port()+'/hashtag/$2">#$2</a>');

			// // replace @mentions but keep them to our site
			// var replacePattern2 = /(^|\s)\@(\w*[&#209;#241;&#225;&#233;&#237;&#243;&#250;&#193;&#201;&#205;&#211;&#218;_]+\w*)/gim;
			// replacedText = replacedText.replace(replacePattern2, '$1<a href="http://universitame.com/perfil/$2">@$2</a>');

			return replacedText;
		};
	}
]);
