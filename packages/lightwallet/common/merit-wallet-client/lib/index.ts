/**
 * The official client library for merit-wallet-service.
 * @module Client
 */

/**
 * Client API.
 * @alias module:Client.API
 */

import { API as Client } from './api';
import { Verifier } from './verifier';
import { Utils } from './common/utils';
import * as sjcl from 'sjcl';
import * as Bitcore from 'merit-lib'; //Yuckity Yuck

export class MeritClient extends Client {
  // I'm not sure that there is any benefit to doing this in the constructor
  // vs right in the class.

  public Verifier: any = Verifier;
  public Utils: any = Utils;
  public sjcl: any = sjcl;
  public Bitcore: Bitcore = Bitcore;
  public sdsa:any;

  constructor(opts:any = {}) {
    super(opts);
  }
}
