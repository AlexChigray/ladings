const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const spritesmith = require('gulp.spritesmith');
const del = require('del');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');

// Static server
gulp.task('server', function () {
  browserSync.init({
    server: {
      baseDir: "build",
      port: 9000
    }
  });
});
/*gulp-watch*/
gulp.watch("build/**/*").on("change", browserSync.reload);
/*gulp-sass*/
gulp.task('styles:compile', function () {
  return gulp.src("src/css/*.scss")
      .pipe(sass())
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(rename("main.min.css"))
      .pipe(plumber())
      .pipe(gulp.dest("build/css"))
      .pipe(browserSync.stream());
});
/*gulp-pug*/
gulp.task('templates:compile', function buildHTML() {

  return gulp.src('src/tempales/sections/index.pug')
      .pipe(pug({
        pretty: true
      }))
      .pipe(plumber())
      .pipe(gulp.dest('build'));
});
/*spritesmith*/
gulp.task('sprite', function (cb) {
  const spriteData = gulp.src('images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss'
  }));
  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('build/css/global/'));
  cb();
});

/*copy*/
gulp.task('copy:fonts', function () {
  return gulp.src('src/fonts/**/*.*')
      .pipe(plumber())
      .pipe(gulp.dest('build/fonts'));
});
gulp.task('copy:images', function () {
  return gulp.src('src/images/**/*.*')
      .pipe(plumber())
      .pipe(gulp.dest('build/images'));
});
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));
/*gulp-watch*/
gulp.task('watch', function () {
  gulp.watch('src/tempales/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('src/css/**/*.scss', gulp.series('styles:compile'));
});
/*default*/
gulp.task('default', gulp.series(
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));