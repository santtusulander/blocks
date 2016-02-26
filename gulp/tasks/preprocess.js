var gulp = require('gulp');
var preprocess = require('gulp-preprocess');

var config = require('../config');

gulp.task('preprocess', function() {
  return gulp.src(config.dist.src + '/components/footer.jsx')
    .pipe(preprocess())
    .pipe(gulp.dest(config.dist.dest))
});
