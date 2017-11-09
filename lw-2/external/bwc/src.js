/**
 * To obtain index.js you shoud browserify this file in standalone mode
 * `browserify src.js --standalone bwc > index.js`
 */
var Client = require('../../../packages/bitcore-wallet-client');
module.exports = Client;