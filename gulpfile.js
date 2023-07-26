const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const minify = require("gulp-minify");
const imagemin = require("gulp-imagemin");
const browsersync = require("browser-sync").create();
const clean = require("gulp-clean");

gulp.task("clean-dist", (cb) => {
  clean("dist");
  cb();
});

gulp.task("prepare-html", (cb) => {
  gulp.src("./src/index.html").pipe(gulp.dest("./dist"));
  cb();
});

gulp.task("prepare-min-css", (cb) => {
  gulp
    .src("./src/scss/**/*")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(concat("style.min.css"))
    .pipe(minify())
    .pipe(gulp.dest("./dist/css"));

  cb();
});
gulp.task("prepare-css", (cb) => {
  gulp
    .src("./src/scss/**/*")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(concat("style.css"))
    .pipe(minify())
    .pipe(gulp.dest("./dist/css"));

  cb();
});

gulp.task("prepare-reset-css", (cb) => {
  gulp
    .src("./src/lib/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(concat("reset.min.css"))
    .pipe(minify())
    .pipe(gulp.dest("./dist/css"));

  cb();
});

gulp.task("prepare-img", (cb) => {
  gulp
    .src("./src/assets/**/*.png")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/assets/"));

  cb();
});

exports.build = gulp.series(
  "clean-dist",
  "prepare-html",
  "prepare-min-css",
  "prepare-css",
  "prepare-reset-css",
  "prepare-img"
);

//-----------------------dev

gulp.task("watch-files", (cb) => {
  gulp.watch(
    "./src/**/*",
    gulp.series(
      "clean-dist",
      "prepare-html",
      "prepare-min-css",
      "prepare-css",
      "prepare-img",
      "browsersyncReload"
    )
  );
  cb();
});

gulp.task("browsersyncServe", (cb) => {
  browsersync.init({
    server: "./src",
  });
  cb();
});

gulp.task("browsersyncReload", (cb) => {
  browsersync.reload();
  cb();
});

exports.dev = gulp.series("watch-files", "browsersyncServe");
