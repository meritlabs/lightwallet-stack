'use strict';

var gulp = require('gulp');
var meritTasks = require('merit-build');

meritTasks('p2p', {skipBrowser: true});

gulp.task('default', ['lint', 'coverage']);
