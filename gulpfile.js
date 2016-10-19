var gulp = require('gulp');
var browserSync = require('browser-sync');
var cp = require('child_process');
//var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var sourcemaps = require('gulp-sourcemaps');


// ---------- Jekyll
var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};
//-- Build the Jekyll Site
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});
//-- Rebuild Jekyll & do page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});
//-- Wait for jekyll-build, then launch the Server
gulp.task('browser-sync', ['css', 'compress', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        },
        notify: false
    });
});

// ----  Final Jekyll

gulp.task('css', function() {
    var processors = [
        autoprefixer({
            browsers: ['last 1 version']
        }), precss()
    ];
    return gulp.src('assets/css/main.css')
        .pipe(sourcemaps.init())
        //.pipe(plumber())
        .pipe(postcss(processors))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./_site/css'))
        .pipe(browserSync.stream());
});

gulp.task('reload', browserSync.reload);
gulp.task('compress', function() {
    return gulp.src('assets/javascripts/**/*.js')
        .pipe(sourcemaps.init())
        //.pipe(plumber())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./_site/javascript'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    gulp.watch('assets/css/**', ['css']);
    gulp.watch('assets/javascripts/**/*.js', ['compress', 'reload']);
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});

gulp.task('default', ['browser-sync', 'watch']);
