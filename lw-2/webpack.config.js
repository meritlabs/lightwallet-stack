// module.exports = {
//   "resolve": {
//     "extensions": [
//       ".ts",
//       ".js"
//     ],
//     "modules": [
//       "./node_modules",
//       "./src/app",
//     ],
//     "alias": [
//       { "@app": "./src/app" },
//       { "merit": "./src/app" }
//     ] 
//   }
// }


// var path = require('path');
// var tsconfig = require('./tsconfig.json');
// var webpackConfig = require('@ionic/app-scripts/config/webpack.config');

// webpackConfig.dev.resolve = webpackConfig.prod.resolve = {
//   extensions: ['.ts', '.js', '.json'],
//   modules: [path.resolve('node_modules')],
//   alias: [{'@app': path.resolve(tsconfig.compilerOptions.baseUrl, './src/app')}]
// };

// module.exports = webpackConfig;

// Overwrite some of the vars for the Ionic webpack build
var path = require('path');
var webpack = require('webpack');

module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    modules: [path.resolve('node_modules')],
    alias: {
      '@app': path.resolve('src/app'),
      'merit': path.resolve('src/app')
    }
  }
};