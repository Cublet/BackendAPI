(function (global) {
	'use strict';

	var gulp = require('gulp'),
		gulpWatch = require('gulp-watch'),
		jsdoc = require('gulp-jsdoc'),
		jshint = require('gulp-jshint'),
		jshintStylish = require('jshint-stylish'),
		jsvalidate = require('gulp-jsvalidate'),
		colors = require('colors');

	function jsdocTask() {
		return gulp.src('./cubletApi/**/*.js')
			.pipe(jsdoc('./docs'));
	}

	function jsdocWatchTask() {
		jsdocTask();
		gulpWatch('./cubletApi/**/*.js', function () {
			global.console.log(colors.yellow.underline('JSDoc Run'));
			jsdocTask();
		});
	}

	function jshintTask() {
		return gulp.src(['./cubletApi/**/*.js', './server.js'])
			.pipe(jshint())
			.pipe(jshint.reporter(jshintStylish));
	}

	function jshintWatchTask() {
		jshintTask();
		gulpWatch(['./cubletApi/**/*.js', './server.js'], function () {
			global.console.log(colors.yellow.underline('JSHint Run'));
			jshintTask();
		});
	}
	
	function jsvalidateTask() {
		return gulp.src(['./cubletApi/**/*.js', './server.js'])
			.pipe(jsvalidate());
	}
	
	function jsvalidateWatchTask() {
		jsvalidateTask();
		gulpWatch(['./cubletApi/**/*.js', './server.js'], function () {
			jsvalidateTask();
		});
	}

	gulp.task('jsdoc', jsdocTask);
	gulp.task('jsdocWatch', jsdocWatchTask);
	gulp.task('jshint', jshintTask);
	gulp.task('jshintWatch', jshintWatchTask);
	gulp.task('jsvalidate', jsvalidateTask);
	gulp.task('jsvalidateWatch', jsvalidateWatchTask);
	gulp.task('default', ['jshintWatch', 'jsvalidateWatch', 'jsdocWatch']);

}(global));