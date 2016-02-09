var gulp = require('gulp');
var env = require('gulp-env');
var pjson = require('../../package.json');

gulp.task('env:dev', function () {
  env({
    vars: {
      DEPLOYMENT_ENV: 'dev',
      NODE_ENV: 'development',
      PACKAGE_VERSION: pjson.version
    }
  });
});

gulp.task('env:build', function () {
  env({
    vars: {
      DEPLOYMENT_ENV: 'live',
      NODE_ENV: 'production',
      PACKAGE_VERSION: pjson.version
    }
  });
});
