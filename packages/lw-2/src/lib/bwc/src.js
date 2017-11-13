/**
  * To obtain index.js you shoud browserify this file in standalone mode
  * `browserify src.js --standalone bwc > index.js`
  * TODO: Incorporate this into our devServer.
  */
 var Client = require('./../../../../packages/bitcore-wallet-client');
 
 module.exports = Client; 
