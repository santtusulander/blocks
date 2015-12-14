var gulp = require('gulp');

gulp.task('default', ['env:dev', 'scss-lint', 'webpack']);
