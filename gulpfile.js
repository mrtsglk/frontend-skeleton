const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('vendor-js', function() {
    return gulp.src('src/vendor/js/**/*').pipe(
        gulp.dest('dist/js')
    ).pipe(browserSync.stream());
});

gulp.task('vendor-styles', function() {
    return gulp.src('src/vendor/css/**/*').pipe(
        gulp.dest('dist/css')
    ).pipe(browserSync.stream());
});

gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
});

gulp.task('styles', gulp.series('sass', function() {
    return gulp.src('src/css/*.css')
        .pipe(concat('style.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
}));

gulp.task('html', function() {
    return gulp.src('src/views/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('serve', function() {
    browserSync.init({
        server: './dist'
    });

    gulp.watch('src/vendor/js/**/*', gulp.series('vendor-js'));
    gulp.watch('src/vendor/css/**/*', gulp.series('vendor-styles'));
    gulp.watch('src/js/*.js', gulp.series('scripts'));
    gulp.watch('src/scss/*.scss', gulp.series('styles'));
    gulp.watch('src/*.html', gulp.series('html'));
});

gulp.task('default', gulp.parallel('vendor-js', 'vendor-styles', 'scripts', 'styles', 'html', 'serve'));