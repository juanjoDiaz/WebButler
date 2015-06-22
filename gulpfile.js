// gulp
  var gulp = require('gulp'),

  // plugins
  jshint = require('gulp-jshint'),
  connect = require('gulp-connect');
 
gulp.task('lint', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('copyToTest', function() {
  return gulp.src('./src/*')
    .pipe(gulp.dest('test/src'));
});

gulp.task('test', ['lint', 'copyToTest'], function () {
  connect.server({
    root: './test',
    port: 8888,
    https: true
  });
});