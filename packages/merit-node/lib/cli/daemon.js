'use strict';

var program = require('commander');
var path = require('path');
var meritcore = require('..');

function main(servicesPath, additionalServices) {
  /* jshint maxstatements: 100 */

  var version = meritcore.version;
  var start = meritcore.scaffold.start;
  var findConfig = meritcore.scaffold.findConfig;
  var defaultConfig = meritcore.scaffold.defaultConfig;

  program
    .version(version)
    .description('Start the current node')
    .option('-c, --config <dir>', 'Specify the directory with Merit Node configuration');

  program.parse(process.argv);

  if (program.config) {
    program.config = path.resolve(process.cwd(), program.config);
  }
  var configInfo = findConfig(program.config || process.cwd());
  if (!configInfo) {
    configInfo = defaultConfig({
      additionalServices: additionalServices,
    });
  }
  if (servicesPath) {
    configInfo.servicesPath = servicesPath;
  }
  start(configInfo);
}

module.exports = main;
