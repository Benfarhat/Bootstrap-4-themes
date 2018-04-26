var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
/* Gulp plugins */
var csscomb = require('gulp-csscomb'); // Réodonner les propriété
var cssbeautify = require('gulp-cssbeautify'); // Améliorer le code (formatage)
var csso = require('gulp-csso'); // Minifier le code css
var rename = require('gulp-rename'); // Renomme les fichiers
var imagemin = require('gulp-imagemin'); // Optimisation des images
var cache = require('gulp-cache'); // Evite la réoptimisation des images déjà otpimisées
/* Options */
var source = './src'; 
var destination = './dist'; 
var application = './app'; 

/* Tasks */
/* Task: From scss to css */
gulp.task('sass', function(){
    return gulp.src(source + '/scss/style.scss')
    .pipe(sass())
    .pipe(csscomb())
    .pipe(cssbeautify({
        indent: '  ',
        openbrace: 'separate-line',
        autosemicolon: true
    }))
    .pipe(gulp.dest(destination + '/css'))
    .pipe(browserSync.reload({
        stream: true
      }))
  });
  /* Task: from css to min.css */
  gulp.task('minify', function () {
    return gulp.src(destination + '/css/*.css')
      .pipe(csso())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest(destination + '/css/'))
      .pipe(browserSync.reload({
        stream: true
      }))
  });
  /* Task: BrowserSync as webserver */
  gulp.task('browserSync', function() {
    browserSync({
      server: {
        baseDir: application
      },
    })
  })
  /* Task: Gulp watching source files */
  gulp.task('watch', ['browserSync', 'sass'], function (){
    gulp.watch('**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload); 
    gulp.watch('app/js/**/*.js', browserSync.reload);
  });
  /* Task: Copy all fonts */
  gulp.task('fonts', function() {
    return gulp.src(source + '/fonts/**/*')
    .pipe(gulp.dest(destination + '/fonts'))
  })
  /* Task: Optimize pictures */
  gulp.task('images', function(){
    return gulp.src(source + '/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest(destination + '/images'))
  });
  /* Task: All task in on time */
  gulp.task('build', function(callback) {
    runSequence('sass', 'minify', ['fonts','images'], function() {
      console.log('finished')
    });
  });