var gulp = require('gulp');

gulp.task('default', ['env:dev', 'preprocess', 'scss-lint', 'webpack']);
