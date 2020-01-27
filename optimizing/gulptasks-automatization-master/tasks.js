/////// Imports ///////

const { config_assets_paths, config_functionalities, config_notification } = require('./config')


/////// Plugins ///////


const gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    imagemin = require('gulp-imagemin'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify-es').default,
    rename = require('gulp-rename'),
    gulpif = require('gulp-if'),
    pathExists = require('path-exists'),
    jpegtran = require('imagemin-jpegtran'),
    gifsicle = require('imagemin-gifsicle'),
    optipng = require('imagemin-optipng'),
    svgo = require('imagemin-svgo'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    lowly = require('lowly');

sass.compiler = require('node-sass');



/////// Tasks ///////

/**
 * Obtain files and folders with directory path
 * @param dir directory path
 * @param ?arrayOfFilesFolders array of files
 * @returns Array with tasks
 */
let obtainImageFilesAndFolders = function(dir, arrayOfFilesFolders) {
    arrayOfFilesFolders = arrayOfFilesFolders || [
        [],
        []
    ]
    try {
        fs.readdirSync(dir).forEach(file => {
            let fullPath = path.join(dir, file);
            if (fs.lstatSync(fullPath).isDirectory()) {
                obtainImageFilesAndFolders(fullPath, arrayOfFilesFolders);
            } else {
                let rex = fullPath.match(/.+\.(gif|jpg|jpeg|tiff|png|svg)$/ig)
                if (rex && rex.length > 0 && !fullPath.includes('lowly')) {
                    arrayOfFilesFolders[0].push(fullPath)
                    arrayOfFilesFolders[1].push(dir)
                }
            }
        });
        return arrayOfFilesFolders
    } catch (e) {
        console.log(e)
    }
}

/**
 * Task to minify images 
 * @param done callback with finish task
 */
let minifiedImages = function(done) {
    if (pathExists.sync(config_assets_paths.images.origin) && pathExists.sync(config_assets_paths.images.dest) && config_functionalities.images.minified) {
        try {
            let files = obtainImageFilesAndFolders(config_assets_paths.images.origin)
            files[0].forEach((filePath, index) => {

                if (config_functionalities.images.lowly) {
                    let image = fs.readFileSync(filePath)
                    let imageName = path.basename(filePath)
                    let imageExtension = path.extname(imageName)
                    let newImagePath = files[1][index] + '/' + imageName.replace(/\.[^/.]+$/, "") + '-lowly.jpg'
                    if (imageExtension.toLowerCase() != '.svg' && !imageName.includes('lowly') && !pathExists.sync(newImagePath)) {
                        lowly(image)
                            .then(buff => {
                                gulp.src(filePath)
                                    .pipe(gulpif(config_notification.activate, notify("Lowly para imágen " + imageName)))
                                fs.writeFileSync(newImagePath, buff)
                            });
                    }
                }
                gulp.src(filePath)
                    .pipe(gulpif(config_notification.activate, notify("Minificando imágen " + path.basename(filePath))))
                    .pipe(imagemin([
                        gifsicle({ interlaced: true }),
                        jpegtran({ progressive: true }),
                        optipng({ optimizationLevel: config_assets_paths.images.optimization_level }),
                        svgo({
                            plugins: [
                                { removeViewBox: true },
                                { cleanupIDs: false }
                            ]
                        })
                    ]))
                    .pipe(gulp.dest(files[1][index]))
            })
        } catch (e) {
            console.log(e)
        }
    }

    // finish task
    done();
}


/**
 * Task to concat and minify CSS files 
 * @param done callback with finish task
 */
let minifyCSS = function(done) {
    if (pathExists.sync(config_assets_paths.css.origin) && pathExists.sync(config_assets_paths.css.dest) && config_functionalities.css.minified_and_concat) {

        try {
            if (config_functionalities.css.sass_compiling) {
                gulp.src(config_assets_paths.css.origin + '*.sass')
                    .pipe(gulpif(config_notification.activate, notify("Compilando archivos SASS a CSS")))
                    .pipe(sass().on('error', sass.logError))
                    .pipe(gulp.dest(config_assets_paths.css.dest));
            }

            gulp.src(config_assets_paths.css.origin + '*.css')
                .pipe(gulpif(config_notification.activate, notify("Minificando y concatenando archivos CSS")))
                .pipe(cleanCSS({ compatibility: 'ie8' }))
                .pipe(concat(config_functionalities.css.output_filename))
                .pipe(gulp.dest(config_assets_paths.css.dest));
        } catch (e) {
            console.log(e)
        }
    }

    // finish task
    done();
}

/**
 * Task to concat and minify JS files 
 * @param done callback with finish task
 */
let minifyJS = function(done) {
    if (pathExists.sync(config_assets_paths.js.origin) && pathExists.sync(config_assets_paths.js.dest) && config_functionalities.js.minified_and_concat) {
        try {
            gulp.src(config_assets_paths.js.origin + '*.js')
                .pipe(gulpif(config_notification.activate, notify("Minificando y concatenando JS")))
                .pipe(concat('concat.min.js'))
                .pipe(gulp.dest(config_assets_paths.js.dest))
                .pipe(rename(config_functionalities.js.output_filename))
                .pipe(uglify())
                .pipe(gulp.dest(config_assets_paths.js.dest));
        } catch (e) {
            console.log(e)
        }
    }
    // finish task
    done();
}


/////// Tasks for watchers ///////

/**
 * Task to minify images for watcher
 * @param done callback with finish task
 */
let WatchMinifiedImages = function(done, pathFile) {
    if (pathExists.sync(config_assets_paths.images.origin) && pathExists.sync(config_assets_paths.images.dest) && pathExists.sync(pathFile) && config_functionalities.images.minified) {
        try {
            if (config_functionalities.images.lowly) {
                let image = fs.readFileSync(pathFile)
                let imageName = path.basename(pathFile)
                let imageExtension = path.extname(imageName)
                let newImagePath = config_assets_paths.images.dest + '/' + imageName.replace(/\.[^/.]+$/, "") + '-lowly.jpg'
                if (imageExtension.toLowerCase() != '.svg' && !imageName.includes('lowly') && !pathExists.sync(newImagePath)) {
                    lowly(image)
                        .then(buff => {
                            gulp.src(pathFile)
                                .pipe(gulpif(config_notification.activate, notify("Lowly para imágen " + imageName)))
                            fs.writeFileSync(newImagePath, buff)
                        });
                }
            }

            gulp.src(pathFile)
                .pipe(gulpif(config_notification.activate, notify("Minificando imágen " + path.basename(pathFile))))
                .pipe(imagemin([
                    gifsicle({ interlaced: true }),
                    jpegtran({ progressive: true }),
                    optipng({ optimizationLevel: config_assets_paths.images.optimization_level }),
                    svgo({
                        plugins: [
                            { removeViewBox: true },
                            { cleanupIDs: false }
                        ]
                    })
                ]))
                .pipe(gulp.dest(config_assets_paths.images.dest))

        } catch (e) {
            console.log(e)
        }
    }

    // finish task
    done();
}


/////// Exports ///////

try {
    module.exports.minifiedImages = minifiedImages
    module.exports.minifyCSS = minifyCSS
    module.exports.minifyJS = minifyJS
    module.exports.WatchMinifiedImages = WatchMinifiedImages
} catch (e) {
    console.log(e)
}