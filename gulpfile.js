var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var cp          = require('child_process');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('css', function () {
  var processors = [
    autoprefixer({browsers: ['last 1 version']}),precss()
];
  return gulp.src('assets/stylesheets/main.css')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(postcss(processors))
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

gulp.task('reload',browserSync.reload);
gulp.task('compress', function() {
  return gulp.src('assets/javascripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./javaScript'))
    .pipe(browserSync.stream());
});

gulp.task('default', function() {
  browserSync.init({
    server: "./"
});
  gulp.watch('assets/stylesheets/*.css', ['css']);
  gulp.watch('assets/javascripts/*.js', ['compress', 'reload']);
  gulp.watch("index.html").on('change', browserSync.reload);
});
