var gulp = require('gulp');
var eslint = require('gulp-eslint');

var config = require('../config');

gulp.task('eslint', function() {
  return gulp.src(config.dist.src + '/js/**')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});
