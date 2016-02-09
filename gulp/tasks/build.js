var gulp = require('gulp');

gulp.task('build', ['env:build', 'preprocess', 'scss-lint', 'eslint', 'webpack']);
