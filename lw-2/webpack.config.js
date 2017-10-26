// The below config override allows Ionic Serve to follow the the alias of 'merit/' --> ./src/app 
// This enables us to do all imports relative to the appRoot.
var path = require('path');
var tsconfig = require('./tsconfig.json');
var webpackConfig = require('@ionic/app-scripts/config/webpack.config');

webpackConfig.dev.resolve = webpackConfig.prod.resolve = {
  extensions: ['.ts', '.js', '.json'],
  modules: [path.resolve('node_modules')],
  alias: {'merit': path.resolve(tsconfig.compilerOptions.baseUrl, './src/app')}
};

module.exports = webpackConfig;