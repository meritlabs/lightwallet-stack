const chalk = require("chalk");
const fs = require('fs');
const path = require('path');
const tsconfig = require('./tsconfig.json');
const webpackConfig = require('@ionic/app-scripts/config/webpack.config.js');
const webpack = require('webpack');
const { execSync } = require('child_process');
const  env = process.env.IONIC_ENV;

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

const DEFINE_PLUGIN = new webpack.DefinePlugin({
  WEBPACK_CONFIG: {
    COMMIT_HASH: JSON.stringify(execSync('git rev-parse HEAD').toString().trim())
  }
});

webpackConfig.dev.plugins.push(DEFINE_PLUGIN);
webpackConfig.prod.plugins.push(DEFINE_PLUGIN);

module.exports = function () {
    return webpackConfig;
};
