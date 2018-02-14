var chalk = require("chalk");
var fs = require('fs');
var path = require('path');
var tsconfig = require('./tsconfig.json');
var webpackConfig = require('@ionic/app-scripts/config/webpack.config.js');

var env = process.env.IONIC_ENV;
console.log('environment setting is: ', env);

webpackConfig.prod.resolve = {
    alias: {
        "@app/env": path.resolve(environmentPath('prod')),
        'merit': path.resolve(tsconfig.compilerOptions.baseUrl, './src/app')
    },
    extensions: ['.ts', '.js', '.json'],
    modules: [path.resolve('node_modules')]
};

webpackConfig.dev.resolve = {
    alias: {
        "@app/env": path.resolve(environmentPath('dev')),
        'merit': path.resolve(tsconfig.compilerOptions.baseUrl, './src/app')
    },
    extensions: ['.ts', '.js', '.json'],
    modules: [path.resolve('node_modules')]
};

if (env !== 'prod' && env !== 'dev') {
    // Default to dev config
    webpackConfig[env] = webpackConfig.dev;
}

function environmentPath(env) {
    var filePath = './src/environments/environment' + (env === 'prod' ? '' : '.' + env) + '.ts';
    //var filePath = './src/environments/environment.ts';
    if (!fs.existsSync(filePath)) {
        console.log(chalk.red('\n' + filePath + ' does not exist!'));
    } else {
        return filePath;
    }
}

module.exports = function () {
    return webpackConfig;
};