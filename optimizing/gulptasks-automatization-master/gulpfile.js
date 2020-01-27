/////// Config imports ///////

const { loadTaskWithConfig, cleanScripts } = require('./utils')
const { config_assets_paths, config_functionalities, config_notification, config_watch } = require('./config')
const { minifiedImages, minifyCSS, minifyJS, WatchMinifiedImages } = require('./tasks')


/////// Plugins ///////

const gulp = require('gulp'),
    { series, watch } = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    pathExists = require('path-exists'),
    chokidar = require('chokidar');

/////// DEFAULT TASK ///////

/**
 * Task default, load dynamic tasks series 
 * @param done callback with finish task
 */
gulp.task('default', function(done) {
    cleanScripts()
    return series(...loadTaskWithConfig(), (seriesDone) => {
        seriesDone();
        done();
    })();
});


if (config_watch.activate) {
    // watchers
    exports.default = function() {
        try {
            let options = {
                persistent: true,
                ignoreInitial: true,
                followSymlinks: true,
                cwd: '.',
                disableGlobbing: true,
                usePolling: true,
                interval: 100,
                binaryInterval: 300,
                alwaysStat: false,
                depth: 99,
                awaitWriteFinish: {
                    stabilityThreshold: 2000,
                    pollInterval: 100
                },
                ignorePermissionErrors: false,
                atomic: true // or a custom 'atomicity delay', in milliseconds (default 100)
            }

            // chokidar watch
            chokidar.watch(config_watch.root_path, options).on('all', (event, filePath) => {
                try {
                    const { done } = require('gulp')
                    let fileName = path.basename(filePath)
                    let fileExtension = path.extname(fileName)

                    // images valid extension
                    let imagesExtensions = ['.jpg', '.jpeg', '.png', '.svg']
                    if (imagesExtensions.includes(fileExtension.toLowerCase())) {
                        WatchMinifiedImages(done, filePath)
                    }
                    // images valid extension
                    let cssExtensions = ['.css', '.sass']
                    if (cssExtensions.includes(fileExtension.toLowerCase())) {
                        cleanScripts()
                        minifyCSS(done)
                    }

                    // js valid extension
                    let jsExtensions = ['.js']
                    if (jsExtensions.includes(fileExtension.toLowerCase())) {
                        cleanScripts()
                        minifyJS(done)
                    }
                } catch (error) {}
            });
        } catch (error) {

        }
    }
}