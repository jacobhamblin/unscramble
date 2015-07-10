var gulp = require('gulp');
var babel = require('gulp-babel');
var cncat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var react = require('gulp-react');

var appPath = 'app/*.jsx';

gulp.task('babel', function () {
    gulp.src([appPath])
        .pipe(react())
        .pipe(babel())
        .pipe(plumber())
        .pipe(cncat('application.js'))
        .pipe(gulp.dest('compiled'));
});

gulp.task('watch', function() {
  gulp.watch([appPath], ['babel']);
});

gulp.task('default', ['babel', 'watch']);

gulp.task('sass', function () {
  gulp.src('./sass/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/*.scss', ['sass']);
});
