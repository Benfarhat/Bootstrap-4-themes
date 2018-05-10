const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
/* Gulp plugins */
const csscomb = require('gulp-csscomb'); // Réodonner les propriété
const cssbeautify = require('gulp-cssbeautify'); // Améliorer le code (formatage)
const csso = require('gulp-csso'); // Minifier le code css
const rename = require('gulp-rename'); // Renomme les fichiers
const imagemin = require('gulp-imagemin'); // Optimisation des images
const cache = require('gulp-cache'); // Evite la réoptimisation des images déjà otpimisées
/* Options */
const source = './src';
const destination = './dist';

/* Tasks Dedicated to Bootstrap */

/* Here we populate source folder */

/* Task: Bootstrap style */
gulp.task('bs-sass', function(){
  return gulp.src(['./node_modules/bootstrap/scss/bootstrap.scss', source + '/scss/*.scss'])
  .pipe(sass())
  .pipe(csscomb())
  .pipe(cssbeautify({
      indent: '  ',
      openbrace: 'separate-line',
      autosemicolon: true
  }))
  .pipe(gulp.dest(source + '/css'))
  .pipe(browserSync.stream());
});



/* Task: Bootstrap scripts */
gulp.task('bs-js', function() {
  return gulp.src(['./node_modules/bootstrap/dist/js/bootstrap.min.js', './node_modules/jquery/dist/jquery.min.js', './node_modules/popper.js/dist/umd/popper.min.js'])
  .pipe(gulp.dest(source + '/js'))
  .pipe(browserSync.stream());
})

/* Task: FontAwesome fonts*/
gulp.task('fa-fonts', function() {
  return gulp.src(['./node_modules/font-awesome/fonts/*'])
  .pipe(gulp.dest(source + '/fonts'))
  .pipe(browserSync.stream());
})
/* Task: FontAwesome style*/
gulp.task('fa-css', function() {
  return gulp.src(['./node_modules/font-awesome/css/font-awesome.min.css'])
  .pipe(gulp.dest(source + '/css'))
  .pipe(browserSync.stream());
})

/* Task: Serve and sass */
gulp.task('serve', ['bs-sass'], function() {
  browserSync.init({
    server: {
      baseDir: source
    },
  })

  gulp.watch(source + '/scss/*.scss', ['bs-sass']);
  gulp.watch(source + '/*.html').on('change', browserSync.reload);

})


gulp.task('serve-root', ['bs-sass'], function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
  })

  gulp.watch(source + '/scss/*.scss', ['bs-sass']);
  gulp.watch('./*.html').on('change', browserSync.reload);

})

gulp.task('default', ['bs-js', 'serve', 'fa-css', 'fa-fonts'])
gulp.task('dev', ['bs-js', 'serve-root', 'fa-css', 'fa-fonts'])




/* Task: Bootstrap style for second theme*/
gulp.task('bs-sass2', function(){
  return gulp.src([source + '/custom/scss/bootstrap2.scss', source + '/scss/*.scss'])
  .pipe(sass())
  .pipe(csscomb())
  .pipe(cssbeautify({
      indent: '  ',
      openbrace: 'separate-line',
      autosemicolon: true
  }))
  .pipe(gulp.dest(source + '/css'))
  .pipe(browserSync.stream());
});


gulp.task('bs-sass3', function(){
  return gulp.src([source + '/custom/scss1/bootstrap3.scss', source + '/scss/*.scss'])
  .pipe(sass())
  .pipe(csscomb())
  .pipe(cssbeautify({
      indent: '  ',
      openbrace: 'separate-line',
      autosemicolon: true
  }))
  .pipe(gulp.dest(source + '/css'))
  .pipe(browserSync.stream());
});


gulp.task('serve-root2', ['bs-sass2'], function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
  })

  gulp.watch(source + '/scss/*.scss', ['bs-sass2']);
  gulp.watch(source + '/custom/scss/*.scss', ['bs-sass2']);
  gulp.watch('./**/*.html').on('change', browserSync.reload);

})


gulp.task('serve-root3', ['bs-sass3'], function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
  })

  gulp.watch(source + '/scss/*.scss', ['bs-sass3']);
  gulp.watch(source + '/custom/scss1/*.scss', ['bs-sass3']);
  gulp.watch('./**/*.html').on('change', browserSync.reload);

})

gulp.task('dev2', ['bs-js', 'serve-root2', 'fa-css', 'fa-fonts'])
gulp.task('dev3', ['bs-js', 'serve-root3', 'fa-css', 'fa-fonts'])

/* ============================================================= */


/* Other tasks */


/* Here we populate destination folder */


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
  .pipe(browserSync.stream());
});
  /* Task: from css to min.css */
  gulp.task('minify', function () {
    return gulp.src(destination + '/css/*.css') // Should not be min.css
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
    browserSync.init({
      server: {
        baseDir: destination
      },
    })
  })
  /* Task: Gulp watching source files */
  gulp.task('watch', ['browserSync', 'sass'], function (){
    gulp.watch(source + 'scss/*.scss', ['sass']);
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
