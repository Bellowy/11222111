var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    include = require('gulp-include'),
    cleanCSS = require('gulp-clean-css'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync');

var PATH = {
    BUILD: 'build/',
    SRC: {
        HTML: 'src/**/*.html',
        STYLE: 'src/**/main.scss',
        IMG: 'src/**/images/**/*.*',
        FONTS: 'src/**/fonts/**/*.*'
    },
    WATCH: {
        HTML: 'src/**/*.html',
        STYLE: 'src/**/*.scss',
        IMG: 'src/**/images/**/*.*',
        FONTS: 'src/**/fonts/**/*.*'
    },
};

var INCLUDE_CONFIG = {
    extensions: 'html',
    includePaths: [ __dirname + '/src' ],
};

var WEB_SERVER_CONFIG = {
    server: { baseDir: PATH.BUILD },
    host: 'localhost',
    port: 9000,
    logPrefix: 'test'
};

gulp.task('webserver', function() {
    browserSync(WEB_SERVER_CONFIG);
});

gulp.task('html:build:dev', function() {
    return gulp.src(PATH.SRC.HTML)
        .pipe(include(INCLUDE_CONFIG))
            .on('error', console.log)
        .pipe(gulp.dest(PATH.BUILD))
        .pipe(browserSync.stream());
});

gulp.task('style:build:dev', function() {
    return gulp.src(PATH.SRC.STYLE)
        .pipe(sass({ errLogToConsole: true }))
        .pipe(prefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest(PATH.BUILD))
        .pipe(browserSync.stream());
});

gulp.task('fonts:build', function() {
    return gulp.src(PATH.SRC.FONTS).pipe(gulp.dest(PATH.BUILD));
});

gulp.task('image:build:dev', function() {
    return gulp.src(PATH.SRC.IMG).pipe(gulp.dest(PATH.BUILD));
});

gulp.task('build-dev', [
    'fonts:build',
    'html:build:dev',
    'style:build:dev',
    'image:build:dev'
]);

gulp.task('watch', function(){
    gulp.watch(PATH.WATCH.HTML, ['html:build:dev']);
    gulp.watch(PATH.WATCH.STYLE, ['style:build:dev']);
    gulp.watch(PATH.WATCH.IMG, ['image:build:dev']);
    gulp.watch(PATH.WATCH.FONTS, ['fonts:build']);
});

gulp.task('dev', ['build-dev', 'webserver', 'watch']);