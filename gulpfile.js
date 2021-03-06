//npm install npm install gulp npm start
"use strict";
var gulp = require('gulp');
var less = require('gulp-less'); //препроцессор less можно gulp-sass
var plumber = require('gulp-plumber'); //обработчик ошибок
var browserSync = require('browser-sync').create(); //livereload
var csso = require('gulp-csso'); //минификатор css
var autoprefixer = require("autoprefixer"); //поддержка для старых браузе
var mqpacker = require("css-mqpacker"); //сортировка css
var minify = require("gulp-csso"); //минификатор js
var rename = require("gulp-rename"); //переименовывать файлы, решайет проблему с лшней папкой less
var postcss = require("gulp-postcss"); //prefix для старых браузеров
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var run = require("run-sequence");
var ghPages = require("gulp-gh-pages");
var uglify = require("gulp-uglify");
var del = require("del");


//gulp.task('less', function() {
//	gulp.src('./prin/**/style.less')
//  .pipe(plumber())
// 	.pipe(less())
//	.pipe(gulp.dest('./prin/css'))
//  .pipe(livereload.stream());
//});

//gulp.task('less:watch', function() {
// gulp.watch('source/**/*.less', ['less']);
//});


// Static server
//gulp.task('serve', ['less'], function() {
//browserSync.init({
// server: "./prin/"
//});
// gulp.watch('./prin/**/*.less', ['less']);
//  gulp.watch("./prin/**/*.less").on('change', browserSync.reload);
//  gulp.watch("./prin/**/*.html").on('change', browserSync.reload);
//});

// function less() {
//    return gulp.src("src/less/style.less")
//   .pipe(plumber())
//   .pipe(less())
//   .pipe(postcss([                                                 // делаем постпроцессинг
//   autoprefixer({ browsers: [
//   'last 2 versions', 
//   'ie 11',
//   'ie 10',
//   'Android >= 4.1', 
//   'Safari >= 8',
//   'iOS >= 8'
//   ] }),     // автопрефиксирование
//   mqpacker({ sort: true })                                     // объединение медиавыражений
// ]))
// //.pipe(gulp.dest("build/css")) положить в папку не сжатый файл
//   .pipe(csso()) //минификатор css
// //  .pipe(minify()) //минифицирует js
//   .pipe(rename('style.min.css'))
//   //.pipe(rename('style.css'))
//   .pipe(gulp.dest('build/css'))
//   .pipe(browserSync.stream());
// }

gulp.task('less', function() {
 gulp.src("src/less/style.less")
	.pipe(plumber())
	.pipe(less())
	.pipe(postcss([                                                 // делаем постпроцессинг
	autoprefixer({ browsers: [
	'last 2 versions', 
	'ie 11',
	'ie 10',
	'Android >= 4.1', 
	'Safari >= 8',
	'iOS >= 8'
	] }),     // автопрефиксирование
	mqpacker({ sort: true })                                     // объединение медиавыражений
]))
//.pipe(gulp.dest("build/css")) положить в папку не сжатый файл
  .pipe(csso()) //минификатор css
//	.pipe(minify()) //минифицирует js
	.pipe(rename('style.min.css'))
	//.pipe(rename('style.css'))
	.pipe(gulp.dest('build/css'))
	.pipe(browserSync.stream());
});

gulp.task("minjs", function() { //минификация js и перенос в папку билд
  gulp.src("src/js/*.js")
    .pipe(uglify())
    .pipe(rename('min.js'))
    .pipe(gulp.dest("build/js"));
});

gulp.task("html", function() {
  gulp.src("src/*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("images", function() { //сжатие картинок без потери качества и перенос в папку bild
  return gulp.src("build/img/**/*.{jpg, png, gif}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("symbols", function() {//несколько свг в один
  return gulp.src("build/img/icons/*.svg")
  .pipe(svgmin())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("symbols.svg"))
  .pipe(gulp.dest("build/img"));
})

gulp.task("copy", function() {
  return gulp.src([
    "src/fonts/**/*.{woff,woff2}",
    "src/img/**",
    "src/js/**",
    "src/*.html"
  ], {
    base: "src/"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build")
});

gulp.task("deploy", function() {
  return gulp.src("./build/**/*")
    .pipe(ghPages());
});

// gulp.task("build", function(fn) {
//   run(
//     "clean",
//     "copy",
//     "less",
//     "minjs",
//     "images",
//     "symbols",
//     fn
//   );
// });

gulp.task('build', gulp.series(
  // gulp.task('clean'),
  // gulp.task('copy'),
  // gulp.task('less'),
  // gulp.task('minjs'),
  // gulp.task('images'),
  // gulp.task('symbols')
    "clean",
    "copy",
    "less",
    "minjs",
    "images",
    "symbols"
  )
);



  // gulp.task('clean');
  // gulp.task('copy');
  // gulp.task('less');
  // gulp.task('minjs');
  // gulp.task('images');
  // gulp.task('symbols');

gulp.task("serve", function() {
  browserSync.init({
    server: "build",
    notify: false,
    open: true,
    ui: false
  });

  //gulp.watch("src/**/*.less", ["build"]);
 //gulp.watch("src/**/*.js", ["build"]);
  //gulp.watch("src/**/*.html", ["build"]);

  gulp.watch("src/**/*.js", ["build"]).on("change", browserSync.reload);
  gulp.watch("src/*.html", ["build"]).on("change", browserSync.reload);
  gulp.watch("src/**/*.less", ["build"]).on('change', browserSync.reload);
});

//оригинальная фукнции для выставвления итогового файла
//gulp.task("serve", function() {
//  server.init({
//    server: "build",
//    notify: false,
//    open: true,
//    ui: false
//  });
//
//gulp.watch("src/less/**/*.less", ["style"]);
//gulp.watch("src/js/**/*.js", ["minjs"]);
//gulp.watch("src/*.html", ["html"]).on("change", server.reload);

var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
 
gulp.task('deploy', function() {
  return gulp.src('build/**/*')
    .pipe(ghPages());
});