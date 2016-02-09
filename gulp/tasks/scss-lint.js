var gulp = require('gulp');
var scsslint = require('gulp-scss-lint');
var cache = require('gulp-cached');

var config = require('../config');

// Lint all scss before compiling
gulp.task('scss-lint', function(cb) {
  gulp.src([config.scss.src])
    .pipe(cache('scsslint'))
    .pipe(scsslint({
      config: config.scss.lint,
      endless: true
    }));
  cb();
});
