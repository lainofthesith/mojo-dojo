const {src, dest, series, parallel, watch} = require('gulp'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    pug = require('gulp-pug'),
    origin = 'src',
    destination = 'build';

 //sets the compiler - forward compatibility
sass.compiler = require('node-sass');

async function clean(cb){
    await del(destination)
}

async function html(cb){
    await src(`${origin}/**/*.pug`)
    .pipe(pug({
        doctype: 'html',
        pretty: false
    }))
    .pipe(dest(destination));
}

async function styles(cb){
    await src(`${origin}/css/animate.css`).pipe(dest(`${destination}/css`));
    src(`${origin}/sass/style.sass`)
    .pipe(sourcemaps.init())
    .pipe(
        sass({
        sourcemap: true,
        outputStyle: 'compressed'
        }).on('error', sass.logError)
        )
        .pipe(dest(`${destination}/css`));
}

async function js(cb){
    await src(`${origin}/js/lib/**/*.js`).pipe(dest(`${destination}/js/lib`));

    //backwards compatibility 
    src(`$origin/js/**/*.js`)
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('build.js'))
    .pipe(dest(`${destination}/js`));
}

function watcher(cb) {
  watch(`${origin}/**/*.html`).on('change', series(html, browserSync.reload))
  watch(`${origin}/**/*.sass`).on('change', series(styles, browserSync.reload))
  watch(`${origin}/**/*.js`).on('change', series(js, browserSync.reload))
  cb();
}

function server(cb){
    browserSync.init({
        notify: false,
        open: true,
        server: {
            baseDir: destination
        }
    });
    cb();
}

exports.default = series(clean, parallel(html, styles, js), server, watcher);
