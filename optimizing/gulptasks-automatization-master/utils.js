/////// Imports ///////

const { minifiedImages, minifyCSS, minifyJS } = require('./tasks')
const { config_functionalities } = require('./config')

/////// Plugins ///////
const path = require('path'),
    fs = require('fs'),
    pathExists = require('path-exists');


/////// Utils ///////

/**
 * Load Tasks with configuration file
 * @returns Array with tasks
 */
let loadTaskWithConfig = function() {
    try {
        let arrTask = []
        if (config_functionalities.images.minified) {
            arrTask.push(minifiedImages)
        }
        if (config_functionalities.css.minified_and_concat) {
            arrTask.push(minifyCSS)
        }
        if (config_functionalities.js.minified_and_concat) {
            arrTask.push(minifyJS)
        }
        return arrTask
    } catch (e) {
        console.log(e)
    }
}

/**
 * Clean if exists JS and CSS files result concat and minify proccess
 */
let cleanScripts = function() {
    try {
        if (pathExists.sync(config_assets_paths.js.dest + 'concat.min.js')) {
            fs.unlinkSync((config_assets_paths.js.dest + 'concat.min.js'))
        }
        if (pathExists.sync(config_assets_paths.js.dest + config_functionalities.js.output_filename)) {
            fs.unlinkSync((config_assets_paths.js.dest + config_functionalities.js.output_filename))
        }
        if (pathExists.sync(config_assets_paths.css.dest + config_functionalities.css.output_filename)) {
            fs.unlinkSync((config_assets_paths.css.dest + config_functionalities.css.output_filename))
        }
    } catch (e) {
        console.log(e)
    }
};

/////// Exports ///////
try {
    module.exports.loadTaskWithConfig = loadTaskWithConfig
    module.exports.cleanScripts = cleanScripts
} catch (e) {
    console.log(e)
}