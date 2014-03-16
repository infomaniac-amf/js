var gulp = require('gulp');
var browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    notify = require( 'gulp-notify'),
    size = require('gulp-size');

// Basic usage
gulp.task('default', function() {

  gulp.watch(['amf.js'], function(e) {
    gulp.src('amf.js')
        .pipe(browserify({
          insertGlobals: true
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'))
        .pipe(notify('Done!'))
        .pipe(size());
  });
});