/**
 * The official client library for merit-wallet-service.
 * @module Client
 */

/**
 * Client API.
 * @alias module:Client.API
 */

import { API as Client } from './api';
import { verifier } from './verifier';
import Utils = require('./common/utils');
import sjcl = require('sjcl');
import Bitcore = require('bitcore-lib');


export class MeritClient extends Client {
  public Verifier:any = verifier;
  public Utils: any = Utils;
  public sjcl: any = sjcl;
}
