var gulp = require('gulp');
var clean = require('gulp-clean');
var cleanSass = require('gulp-clean');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');




gulp.task('clean', function(){
	return gulp.src('dist')
		.pipe(clean());
});

gulp.task('copy', ['clean'], function(){
	return gulp.src(['app/**/*', '!app/assets/css/**/*.scss'])
		.pipe(gulp.dest('dist'));
});

gulp.task('copyHtml', function(){
	gulp.src('app/**/*.html')
		.pipe(gulp.dest('dist'));
});


gulp.task('sass', function(){

	return gulp.src('app/assets/css/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('dist/assets/css/'));
});

gulp.task('cleanSass', ['sass', 'copy'], function(){
	return gulp.src('dist/assets/css/modulos/')
		.pipe(clean());
});

gulp.task('imagemin', ['cleanSass'], function(){
	return gulp.src('dist/assets/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/assets/img/'));

});

gulp.task('server', ['imagemin'], function(){

	browserSync.init({
		server: {
			baseDir: 'dist'
		}
	});

	gulp.watch('app/assets/css/**/*.scss', ['sass']);
	gulp.watch('app/**/*.html', ['copyHtml']);

	gulp.watch(['app/assets/js/**/*.js', 'app/**/*.js']).on('change', function(event){
		gulp.src(event.path)
			.pipe(jshint())
			.pipe(jshint.reporter(jshintStylish));		
	});

	gulp.watch('dist/**/*').on('change', browserSync.reload);
});


