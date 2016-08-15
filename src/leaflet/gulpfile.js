var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    del = require('del'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    cp = require('child_process'),
    changed = require('gulp-changed'),
    size = require('gulp-size');


gulp.task('styles', function() {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('browser-sync', ['styles'], function() {
  browserSync({
    server: {
      baseDir: "."
    }
  });
});

gulp.task('watch', function() {
  gulp.watch(['./**/*.html',
              './sass/**/*.scss'
            ], ['styles']).on('change' , function () {
              browserSync.reload();
  });
});

gulp.task('default', function() {
    gulp.start('styles', 'browser-sync', 'watch');
});
