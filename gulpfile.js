/* global require */

var gulp = require("gulp");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");
var uglify = require("gulp-uglify");
var header = require("gulp-header");
var rename = require("gulp-rename");
var outputPath = "dist";

gulp.task("build:js", function () {
    var pkg = require('./package.json');
    var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

    return gulp.src("src/js/jquery.simplewizard.js")
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest(outputPath));
});

gulp.task("minify:js", ["build:js"], function () {
    return gulp.src(outputPath + "/jquery.simplewizard.js")
        .pipe(sourcemaps.init())
        .pipe(uglify({
            preserveComments: "license"
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write("/"))
        .pipe(gulp.dest(outputPath));
});

gulp.task("build:sass", function () {
    return gulp.src("src/scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["> 1%", "last 4 version", "ie 9"],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outputPath));
});

gulp.task("watch", function () {
    gulp.watch("scss/**/*.scss", ["build:sass"]);
});

gulp.task("publish", ["minify:js", "build:sass"]);

gulp.task("default", ["build:js", "build:sass"]);
