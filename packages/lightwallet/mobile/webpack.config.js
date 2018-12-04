const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const webpackConfig = require('@ionic/app-scripts/config/webpack.config.js');
const webpack = require('webpack');
const { execSync } = require('child_process');
const env = process.env.IONIC_ENV || 'dev';
// IONIC_ENV only supports prod and dev, so we need to pass staging in its own env var as a workaround for now.
const staging = process.env.LW_STAGING;

if (env !== 'prod' && env !== 'dev') {
  // Default to dev config
  webpackConfig[env] = webpackConfig.dev;
}

if (env === 'prod') {
  webpackConfig.prod.resolve = {
    alias: {
      '@app/env': path.resolve(environmentPath('prod')),
      '@merit/mobile': path.resolve(__dirname, './src'),
      '@merit/common': path.resolve(__dirname, '../common'),
    },
    extensions: ['.ts', '.js', '.json'],
    modules: [path.resolve('node_modules')],
  };
} else {
  webpackConfig.dev.resolve = {
    alias: {
      '@app/env': path.resolve(environmentPath('dev')),
      '@merit/mobile': path.resolve(__dirname, './src'),
      '@merit/common': path.resolve(__dirname, '../common'),
    },
    extensions: ['.ts', '.js', '.json'],
    modules: [path.resolve('node_modules')],
  };
}

function environmentPath(env) {
  env = staging ? 'staging' : env || 'dev';
  console.log('environment setting is: ', env);

  const filePath = path.resolve(__dirname, '../common/environments/environment.' + env + '.ts');
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red('\n' + filePath + ' does not exist!'));
  } else {
    return filePath;
  }
}

const DEFINE_PLUGIN = new webpack.DefinePlugin({
  WEBPACK_CONFIG: {
    COMMIT_HASH: JSON.stringify(
      execSync('git rev-parse --short HEAD')
        .toString()
        .trim(),
    ),
    VERSION: JSON.stringify(require('./package.json').version),
  },
});

webpackConfig.dev.plugins.push(DEFINE_PLUGIN);
webpackConfig.prod.plugins.push(DEFINE_PLUGIN);

module.exports = function() {
  return webpackConfig;
};
