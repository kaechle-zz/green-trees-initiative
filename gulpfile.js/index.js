const gulp = require("gulp"),
      sass = require("gulp-sass"),
      postcss = require("gulp-postcss"),
      autoprefixer = require("autoprefixer"),
      cssnano = require("cssnano"),
      sourcemaps = require("gulp-sourcemaps"),
      browserSync = require("browser-sync").create(),
      del = require('delete'),
      build = gulp.parallel(style, watch),
      { series } = require('gulp'),
      { src, dest } = require('gulp');

const paths = {
        styles: {
          src: "src/scss/**/*.scss",
          dest: "src/css"
        },
        js: {
          src: "src/jssrc/**/*.js",
          dest: "src/js"
        }
      };

function clean(cb) {
  del([jsDistro], [cssDistro], cb);
}

function style() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init()) // init sourcemaps
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(postcss([autoprefixer(), cssnano()])) // Use postcss with autoprefixer and compress the compiled file using cssnano
    .pipe(sourcemaps.write()) // Now add/write the sourcemaps
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream()); // Add browsersync stream pipe after compilation
}

function reload() {
  browserSync.reload();
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./src"
    }
  });
  gulp.watch(paths.styles.src, style);
  gulp.watch("src/*.html").on('change', browserSync.reload);
}

gulp.task('default', build);

exports.watch = watch
exports.style = style;