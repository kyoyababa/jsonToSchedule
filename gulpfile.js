var gulp =        require('gulp');
var plumber =     require('gulp-plumber');
var sass =        require('gulp-sass');
var sourcemaps =  require('gulp-sourcemaps');
var cssmin  =     require('gulp-cssmin');
var uglify =      require('gulp-uglify');
var jsonmin =     require('gulp-jsonmin');
var imagemin =    require('gulp-imagemin');
var watch =       require('gulp-watch');

gulp.task('sass', function() {
  gulp.src('assets/_scss/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('assets/_css'));
});

gulp.task('cssmin', function () {
  gulp.src(['assets/_css/*.css', '!assets/css/*.css'])
    .pipe(plumber())
    .pipe(cssmin())
    .pipe(gulp.dest('assets/css'));
});

gulp.task('uglify', function() {
  gulp.src(['assets/_js/**/*.js', '!assets/js/**/*'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('assets/js'));
});

gulp.task('jsonmin', function () {
  gulp.src(['assets/_js/**/*.json', '!assets/js/**/*.json'])
    .pipe(plumber())
    .pipe(jsonmin())
    .pipe(gulp.dest('assets/js'));
});

gulp.task('imagemin', function() {
  var imageminOptions = {
    optimizationLevel: 7
  };

  gulp.src(['assets/_images/*.+(jpg|jpeg|png|gif|svg)', '!assets/images/*.+(jpg|jpeg|png|gif|svg)'])
    .pipe(plumber())
    .pipe(imagemin(imageminOptions))
    .pipe(gulp.dest('assets/images'));
});

gulp.task('default', function() {
  gulp.start(['sass']);
  gulp.start(['cssmin']);
  gulp.start(['uglify']);
  gulp.start(['jsonmin']);
  gulp.start(['imagemin']);

  watch('assets/_scss/*.scss', function(event){
    gulp.start(['sass']);
  });

  watch(['assets/_css/*.css', '!assets/css/*.css'], function(event){
    gulp.start(['cssmin']);
  });

  watch(['assets/_js/**/*.js', '!assets/js/**/*.js'], function(event){
    gulp.start(['uglify']);
  });

  watch(['assets/_js/**/*.json', '!assets/js/**/*.json'], function(event){
    gulp.start(['jsonmin']);
  });

  watch(['assets/_images/*.+(jpg|jpeg|png|gif|svg)', '!assets/images/*.+(jpg|jpeg|png|gif|svg)'], function(event){
    gulp.start(['imagemin']);
  });
});
