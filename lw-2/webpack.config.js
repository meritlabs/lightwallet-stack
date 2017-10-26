module.exports = {
  "resolve": {
    "extensions": [
      ".ts",
      ".js"
    ],
    "modules": [
      "./node_modules",
      "./src/app",
    ],
    "alias": [
      { "@app": "./src/app" },
      { "merit": "./src/app" }
    ] 
  }
}


// var path = require('path');
// var tsconfig = require('./tsconfig.json');
// var webpackConfig = require('@ionic/app-scripts/config/webpack.config');

// webpackConfig.dev.resolve = webpackConfig.prod.resolve = {
//   extensions: ['.ts', '.js', '.json'],
//   modules: [path.resolve('node_modules'), path.resolve(tsconfig.compilerOptions.baseUrl)],
//   alias: [{"@app": path.resolve(tsconfig.compilerOptions.baseUrl)}]
// };

// module.exports = webpackConfig;