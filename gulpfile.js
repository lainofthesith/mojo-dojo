const {src, dest, series, parallel, watch} = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const pug = require('gulp-pug');

const origin = 'src';
const destination = 'build';

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

async function css(cb){
    await src(`${origin}/css/animate.css`).pipe(dest(`${destination}/css`));
    src(`${origin}/css/style.sass`)
    .pipe(sass({
        outputStyle: 'compressed'
    }))
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
  watch(`${origin}/**/*.sass`).on('change', series(css, browserSync.reload))
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

exports.default = series(clean, parallel(html, css, js), server, watcher);
