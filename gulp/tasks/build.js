var gulp = require('gulp');

gulp.task('build', ['env:build', 'scss-lint', 'eslint', 'webpack']);
