'use strict';

var semver = require('semver');
var packageData = require('./package.json');

function nodeVersionCheck(version, expected) {
  if (!semver.satisfies(version, expected)) {
    throw new Error('Node.js version ' + version + ' is expected to be ' + expected);
  }
}
nodeVersionCheck(process.versions.node, packageData.engines.node);

module.exports = require('./lib');
module.exports.nodeVersionCheck = nodeVersionCheck;
module.exports.Node = require('./lib/node');
module.exports.Transaction = require('./lib/transaction');
module.exports.Service = require('./lib/service');
module.exports.errors = require('./lib/errors');

module.exports.services = {};
module.exports.services.Address = require('./lib/services/address');
module.exports.services.Bitcoin = require('./lib/services/bitcoind');
module.exports.services.DB = require('./lib/services/db');
module.exports.services.Web = require('./lib/services/web');

module.exports.scaffold = {};
module.exports.scaffold.create = require('./lib/scaffold/create');
module.exports.scaffold.add = require('./lib/scaffold/add');
module.exports.scaffold.remove = require('./lib/scaffold/remove');
module.exports.scaffold.start = require('./lib/scaffold/start');
module.exports.scaffold.callMethod = require('./lib/scaffold/call-method');
module.exports.scaffold.findConfig = require('./lib/scaffold/find-config');
module.exports.scaffold.defaultConfig = require('./lib/scaffold/default-config');

module.exports.cli = {};
module.exports.cli.main = require('./lib/cli/main');
module.exports.cli.daemon = require('./lib/cli/daemon');
module.exports.cli.bitcore = require('./lib/cli/bitcore');
module.exports.cli.bitcored = require('./lib/cli/bitcored');
