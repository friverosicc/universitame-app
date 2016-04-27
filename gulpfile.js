var path 				= require('path'),
	gulp 				= require('gulp'),
	del 				= require('del'),
	connect 			= require('gulp-connect'),	
	minifyCSS 			= require('gulp-minify-css'),	
	sass 				= require('gulp-ruby-sass'),
	imagemin 			= require('gulp-imagemin'),	
	program 			= require('commander'),
	stylish 			= require('jshint-stylish'),	
	uglify 				= require('gulp-uglify'),
	jshint 				= require('gulp-jshint'),		
	ngtemplate 			= require('gulp-ng-templates'),		
	htmlmin 			= require('gulp-htmlmin'),	
	concat 				= require('gulp-concat'),
	rename 				= require('gulp-rename'),	
	templateCache 		= require('gulp-angular-templatecache'),
	historyApiFallback	= require('connect-history-api-fallback');

	
	// protractor = require("gulp-protractor").protractor,
	// karma = require('gulp-karma'),
	

var	debug 		= false,
	WATCH_MODE 	= 'watch',
	RUN_MODE 	= 'watch'; //'run';


var mode = RUN_MODE;

// Sass will check these folders for files when you use @import.
var sassPaths = [		
	'vendor/bootstrap-sass/assets/stylesheets',
	'vendor/fontawesome/scss',
	'vendor/gridle/sass',
	'vendor/angular-motion/dist/',
	'vendor/bootstrap-additions/dist/',
	'vendor/animate.css/'
	];

var jsVendor = [
	'vendor/jquery/dist/jquery.js',        		
	'vendor/underscore/underscore.js',
    'vendor/angular/angular.js',
    'vendor/angular-animate/angular-animate.js',
    'vendor/angular-sanitize/angular-sanitize.js',    
    'vendor/angular-strap/dist/angular-strap.js',
    'vendor/angular-strap/dist/angular-strap.tpl.js',
    'vendor/angular-ui-router/release/angular-ui-router.js',
    'vendor/ngstorage/ngStorage.js',
    'vendor/angular-ui-select/dist/select.js',
    'vendor/moment/moment.js',
    'vendor/moment/locale/es.js',
    'vendor/angular-moment/angular-moment.js',
    'vendor/angular-elastic/elastic.js',
    'vendor/ngInfiniteScroll/build/ng-infinite-scroll.js',
    'vendor/angular-timer/dist/angular-timer.js',
    'vendor/humanize-duration/humanize-duration.js',
    'vendor/fastclick/lib/fastclick.js'
    ];

var src = {
	cwd 		: 'src/app',
	dist 		: 'dist',
	scripts 	: '*/*.js',
	index 		: 'app.js',
	templates 	: '*/*.tpl.html',
};

function list(val) {
	return val.split(',');
}

program
	.version('0.0.1')
	.option('-t, --tests [glob]', 'Specify which tests to run')
	.option('-b, --browsers <items>', 'Specify which browsers to run on', list)
	.option('-r, --reporters <items>', 'Specify which reporters to use', list)
	.parse(process.argv);

gulp.task('js', function() {
	var jsTask = gulp.src(['src/admin/**/*.js', 'src/app/**/*.js', 'src/common/**/*.js']);	

	jsTask.pipe(concat('universitame-app.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist'))
	.pipe(connect.reload());
});

gulp.task('js:vendor', function() {
	gulp.src(jsVendor)
	.pipe(concat('vendor.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist'));
});

gulp.task('html', function() {
	var templateTask = gulp.src('src/*.html');

	if (!debug) {
		templateTask.pipe(htmlmin({ collapseWhitespace: true }));
	}

	templateTask.pipe(gulp.dest('dist'))
	.pipe(connect.reload());	
});

gulp.task('template', ['template:concat'], function(cb) {
	del(['dist/ui-select-tpl.js', 'dist/ui-bootstrap-tpl.js'], cb);
});

gulp.task('template:concat', ['template:compile', 'template:compileCustom'], function() {	
	return gulp.src(['dist/ui-select-tpl.js', 'dist/ui-bootstrap-tpl.js', 'dist/universitame-tpl.js'])
	.pipe(concat('universitame-tpl.js'))
	.pipe(gulp.dest('dist'))
	.pipe(connect.reload());
});

gulp.task('template:compile', function () {	
	return gulp.src(['src/app/**/*.tpl.html', 'src/app/*.tpl.html', 'src/common/**/*.tpl.html', 'src/admin/**/*.tpl.html'])
	.pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(ngtemplate('universitame-tpl'))	
	.pipe(uglify())
	.pipe(concat('universitame-tpl.js'))
	.pipe(gulp.dest('dist'));	
});

gulp.task('template:compileCustom', function () {	
	gulp.src('src/customTemplates/ui-select/**/*.tpl.html')		
		.pipe(templateCache({ module : 'ui.select' }))
		// .pipe(uglify())
		.pipe(concat('ui-select-tpl.js'))
		.pipe(gulp.dest('dist'));

	// gulp.src('src/customTemplates/ui-bootstrap/**/*.html')
	// 	.pipe(templateCache({ module : 'template/typeahead/typeahead-popup.html' }))
	// 	// .pipe(uglify())
	// 	.pipe(concat('ui-bootstrap-tpl.js'))
	// 	.pipe(gulp.dest('dist'));
});

gulp.task('css', ['css:angular-motion', 'css:bootstrap-additions', 'css:animate-css'], function() {
	gulp.src('src/sass/app.scss')
	.pipe(sass({
		loadPath: sassPaths,
		style: 'nested',
		bundleExec: true
    }))
	.on('error', function(e) {
		console.log(e);
	})	
	.pipe(minifyCSS())
	.pipe(gulp.dest('./dist/css/'))
	.pipe(connect.reload());	
});

gulp.task('css:angular-motion', function() {
	gulp.src("vendor/angular-motion/dist/angular-motion.css")
	.pipe(rename("vendor/angular-motion/dist/angular-motion.scss"))
	.pipe(gulp.dest("."));
});

gulp.task('css:bootstrap-additions', function() {
	gulp.src("vendor/bootstrap-additions/dist/bootstrap-additions.css")
	.pipe(rename("vendor/bootstrap-additions/dist/bootstrap-additions.scss"))
	.pipe(gulp.dest("."));
});

gulp.task('css:animate-css', function() {
	gulp.src("vendor/animate.css/animate.css")
	.pipe(rename("vendor/animate.css/animate.scss"))
	.pipe(gulp.dest("."));
});

gulp.task('font', function() {
	// Copiamos las fuentes de Awasom Fonts
	gulp.src(['vendor/bootstrap-sass-official/assets/fonts/bootstrap/glyphicons-halflings-regular.*'])
	.pipe(gulp.dest('dist/fonts/bootstrap'));

	gulp.src(['vendor/fontawesome/fonts/**.*'])
	.pipe(gulp.dest('dist/fonts'));
});

gulp.task('image', function () {
	gulp.src('src/assets/img/**/**.*')
	.pipe(imagemin())
	.pipe(gulp.dest('dist/img'))
	.pipe(connect.reload());
});

gulp.task('lint', function() {
	gulp.src('src/app/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter(stylish));

	gulp.src('src/common/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter(stylish));

	gulp.src('src/admin/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter(stylish));
});

// gulp.task('karma', function() {
//   // undefined.js: unfortunately necessary for now
//   return gulp.src(['undefined.js'])
//     .pipe(karma({
//       configFile: 'karma.conf.js',
//       action: mode,
//       tests: program.tests,
//       reporters: program.reporters || ['progress'],
//       browsers: program.browsers || ['PhantomJS']
//     }))
//     .on('error', function() {});
// });

// gulp.task('protractor', function(done) {
//   gulp.src(["test/ui/**/*.js"])
//     .pipe(protractor({
//       configFile: 'protractor.conf.js',
//       args: [
//         '--baseUrl', 'http://127.0.0.1:8080',
//         '--browser', program.browsers ? program.browsers[0] : 'phantomjs'
//       ]
//     }))
//     .on('end', function() {
//       if (mode === RUN_MODE) {
//         connect.serverClose();
//       }
//       done();
//     })
//     .on('error', function() {
//       if (mode === RUN_MODE) {
//         connect.serverClose();
//       }
//       done();
//     });
// });

gulp.task('connect', function() {
	if (mode === WATCH_MODE) {
		gulp.watch(['src/index.html'], function() {
			gulp.src(['src/index.html'])
			.pipe(connect.reload());
		});
	}

	connect.server({
		root : 'dist',
		livereload: mode === WATCH_MODE,
		port : 8081,
		middleware: function(connect, opt) {
			return [ historyApiFallback ];
		}
	});
});

gulp.task('debug', function() {
	debug = true;
});

gulp.task('watch-mode', function() {
	mode = WATCH_MODE;

	var jsWatcher = gulp.watch(['src/app/**/*.js', 'src/common/**/*.js'], ['js']),
		//cssWatcher = gulp.watch('src/scss/**/*.scss', ['css', 'protractor']),
		cssWatcher = gulp.watch('src/sass/**/*.scss', ['css']),
		imageWatcher = gulp.watch('src/assets/img/**/*', ['image']),
		// htmlWatcher = gulp.watch('src/template/**/*.html', ['template', 'protractor']), 'src/app/**/*.html', 'src/app/*.html', 'src/*.html', 
		htmlWatcher = gulp.watch(['src/**/*.html'], ['template', 'html']); 
		// testWatcher = gulp.watch('test/**/*.js', ['karma', 'protractor']);

	function changeNotification(event) {
		console.log('File', event.path, 'was', event.type, ', running tasks...');
	}

	jsWatcher.on('change', changeNotification);
	cssWatcher.on('change', changeNotification);
	imageWatcher.on('change', changeNotification);
	htmlWatcher.on('change', changeNotification);
	// testWatcher.on('change', changeNotification);
});

gulp.task('assets', ['css', 'font', 'js:vendor', 'js', 'lint', 'image', 'html', 'template']);
// gulp.task('all', ['assets', 'karma', 'protractor']);
gulp.task('all', ['assets']);
gulp.task('default', ['watch-mode', 'all']);
gulp.task('server', ['connect', 'default']);
gulp.task('test', ['debug', 'connect', 'all']);