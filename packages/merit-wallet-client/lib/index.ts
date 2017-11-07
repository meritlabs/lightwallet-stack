/**
 * The official client library for merit-wallet-service.
 * @module Client
 */

/**
 * Client API.
 * @alias module:Client.API
 */
import client = require('./api');
import verifier = require('./verifier');
import Utils = require('./common/utils');
import sjcl = require('sjcl');
import Bitcore = require('bitcore-lib');

client.Verifier = verifier;
client.Utils = verifier;
client.sjcl = sjcl;
client.Bitcore = Bitcore;

export = client;

// export class ClientCore {
//   constructor(){
//     this = client;
//   }

// }