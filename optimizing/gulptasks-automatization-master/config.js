// Imports 
const yaml = require('js-yaml'),
    fs = require('fs');

// obtenemos información de archivo de configuración
let parseYMLConfigFile = function() {

    try {
        let CustomType = new yaml.Type('customTypeName', {
            kind: 'mapping'
        });
        let CUSTOM_SCHEMA = yaml.Schema.create([CustomType]);
        let parsed_yaml_data = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'), {
            schema: CUSTOM_SCHEMA
        });

        // llenamos las variables con los valores del archivo de configuración
        config_assets_paths = parsed_yaml_data.assets_paths
        config_functionalities = parsed_yaml_data.functionalities
        config_notification = parsed_yaml_data.notifications
        config_watch = parsed_yaml_data.watch

        return [config_assets_paths, config_functionalities, config_notification, config_watch]
    } catch (e) {
        console.log(e);
    }
}


try {
    let configuration = parseYMLConfigFile()
    module.exports.config_assets_paths = configuration[0]
    module.exports.config_functionalities = configuration[1]
    module.exports.config_notification = configuration[2]
    module.exports.config_watch = configuration[3]
} catch (e) {
    console.log(e)
}