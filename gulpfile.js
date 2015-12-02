var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('default', function() {
  // place code for your default task here
	gulp.watch('ts/*.ts',['ts']);
});

gulp.task('ts',function (){
	return gulp.src('ts/*.ts')
        .pipe(ts({
            noImplicitAny: true
        }))
        .pipe(gulp.dest('built/'));
});

