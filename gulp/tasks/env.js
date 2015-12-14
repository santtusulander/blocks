var gulp = require('gulp');
var env = require('gulp-env');

gulp.task('env:dev', function () {
  env({
    vars: {
      DEPLOYMENT_ENV: 'dev',
      NODE_ENV: 'development'
    }
  });
});

gulp.task('env:build', function () {
  env({
    vars: {
      DEPLOYMENT_ENV: 'live',
      NODE_ENV: 'production'
    }
  });
});
