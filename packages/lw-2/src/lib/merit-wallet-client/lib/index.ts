/**
 * The official client library for merit-wallet-service.
 * @module Client
 */

/**
 * Client API.
 * @alias module:Client.API
 */

import { API as Client, IAPI } from './api';
import { Verifier } from './verifier';
import { Utils } from './common/utils';
import * as sjcl from 'sjcl';
//import * as Bitcore from '../../../../node_modules/bitcore-lib'; //Yuckity Yuck
import * as Bitcore from 'bitcore-lib'; //Yuckity Yuck
//const Bitcore = require('bitcore-lib');

export interface IMeritClient extends IAPI {
  Verifier: any;
  Utils: any;
  sjcl: any;
  Bitcore: Bitcore;
}

export class MeritClient extends Client implements IMeritClient {
  // I'm not sure that there is any benefit to doing this in the constructor 
  // vs right in the class.  

  public Verifier: any = Verifier;
  public Utils: any = Utils;
  public sjcl: any = sjcl;
  public Bitcore: Bitcore = Bitcore;

  constructor(opts:any = {}) {
    super(opts);
  }
}
