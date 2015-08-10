var gulp = require( 'gulp' )
var uglify = require('gulp-uglify');

var seajs = require('gulp-seajs');
var transport = require("gulp-seajs-transport");

gulp.src("./src/*.js")
    .pipe(transport())
    .pipe(gulp.dest("./dist"));