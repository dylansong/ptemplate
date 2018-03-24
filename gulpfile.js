var gulp = require('gulp'),
	bs = require('browser-sync'),
    tinypng = require('gulp-tinypng'),
    RevAll = require('gulp-rev-all'),
    qiniu = require('gulp-qiniu'),
    awspublish = require('gulp-awspublish'),
    rename = require('gulp-rename'),
    aws = require('./api').aws;
    qn = require('./api').qn;

var PV = '201803yzjuanzhou';
var publisher = awspublish.create(aws);
var headers = {'Cache-Control': 'max-age=315360000, no-transform, public'};

gulp.task('aws', function () {
    gulp.src('./cdn/**')
        .pipe(rename(function (path) {
        path.dirname = PV+'/'+ path.dirname;
    }))
        // .pipe(rename({dirname:'p6'+path.dirname}))
        .pipe(awspublish.gzip())
        .pipe(publisher.publish(headers))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter())

});




gulp.task('rev', function () {

    // var revAll = new RevAll({prefix:'http://s3-us-west-2.amazonaws.com/moconf/'});
    var revAll = new RevAll({ prefix: 'http://f.elive.sh/'+PV+'/',dontRenameFile: [/^\/favicon.ico$/g, '.html','.php'] });
    gulp.src('./src/**')
        .pipe(revAll.revision())
        .pipe(gulp.dest('./cdn'))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest('./cdn'))
});



gulp.task('qn',function(){
    gulp.src('./cdn/**')
    .pipe(qiniu(qn, {
    dir: PV+'/',
    versioning: false,
    versionFile: './cdn.json'
  }))
})





// tinypng api key 1:J_lDrGlbbje-2nUUcSmlpJZ5-WauYQmE           // dylan.song@gmail.com
// tinypng api key 2:nOFIPN8Pu0Chwuub4CyKmD8GquHhup5Z           // dylan.zhang@elive.sh
// tinypng api key 3:dbGM5WJFCweUVzoZPKI1lMcqpspp46r0           // zxs@me.com
// tinypng api key 4:9NSBUPq3NQVGxHBvEeoh-hPb0le8H0Wl           // kelly.zhang@elive.sh    778314
// tinypng api key 5:RfRzmEgC1W2dNQd58XcTY_PfRrev0xH6           // weijing.z@gmail.com     bb831014

gulp.task('tinypng', function () {
    gulp.src(['./app/**/*.png','./app/**/*.jpg'])
        .pipe(tinypng('J_lDrGlbbje-2nUUcSmlpJZ5-WauYQmE'))
        .pipe(gulp.dest('./app'));
});

gulp.task('browsersync',function(){bs.init({port:3003,server:{baseDir:'./src/'}})})

gulp.task('reload', function() {
    bs.reload();
});

gulp.task('default',['watch']);
//gulp.task('default',['publish']);
gulp.task('watch',['browsersync'],function(){
		//gulp.start('publish');
		gulp.watch('./src/*.html',['reload']);
        gulp.watch('./src/sass/*.scss',['css']);
	 	gulp.watch('./src/js/*.js',['reload']);
        gulp.watch("./src/stylesheets/*.css").on('change', bs.reload);
});








function handleError(error){
	console.log(error.toString());
	this.emit('end');

}
