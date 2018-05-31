import { ENV } from '@app/env';
import { HttpClient } from '@angular/common/http';
import * as request from 'superagent';
import { each, isString } from 'lodash';

import * as Bitcore from 'bitcore-lib';
import { Credentials } from '@merit/common/merit-wallet-client/lib/credentials';
import { Common } from '@merit/common/merit-wallet-client/lib/common';
import { MWCErrors } from '@merit/common/merit-wallet-client/lib/errors';
import { Logger } from '@merit/common/merit-wallet-client/lib/log';

export interface AchivementClientOptions {
  baseUrl?: string;
  request?: any;
}

export class MeritAchivementClient {
  private request: any;
  private baseUrl: string;
  private credentials: Credentials;
  private log: any;

  public onAuthenticationError: any;

  constructor(opts: AchivementClientOptions) {
    this.baseUrl = opts.baseUrl || ENV.achievementApi;
    this.request = opts.request || request;

    this.log = Logger.getInstance();
  }

  setOnAuthenticationError(cb: any) {
    this.onAuthenticationError = cb;
  }

  static fromObj(obj) {
    let client = new this({
      baseUrl: obj.baseUrl || ENV.achievementApi,
    });

    return client.import(obj.credentials);
  }

  login() {
    return this._doPostRequest('/sessions');
  }

  get(url) {
    return this._doGetRequest(url);
  }

  /**
   * Import wallets
   *
   * @param {Object} str - The serialized JSON created with #export
   */
  import(str: string): any {
    try {
      let credentials = Credentials.fromObj(JSON.parse(str));
      this.credentials = credentials;
    } catch (ex) {
      throw MWCErrors.INVALID_BACKUP;
    }

    return this;
  }

  /**
   * Do a GET request
   * @private
   *
   * @param {String} url
   * @param {Callback} cb
   */
  _doGetRequest(url: string): Promise<any> {
    return this._doRequest('get', url, {}).then(res => res.body);
  }

  /**
   * Do a POST request
   * @private
   *
   * @param {String} url
   * @param {Object} args
   * @param {Callback} cb
   */
  _doPostRequest(url: string, args: any = {}): Promise<any> {
    return this._doRequest('post', url, args).then(res => res.body);
  }

  /**
   * Do an HTTP request
   * @private
   *
   * @param {Object} method
   * @param {String} url
   * @param {Object} args
   */
  protected _doRequest(method: string, url: string, args?: any): Promise<{ body: any; header: any }> {
    return new Promise((resolve, reject) => {
      let headers = {};

      if (this.credentials) {
        let privkey = args._requestPrivKey || this.credentials.walletPrivKey;

        if (privkey) {
          delete args['_requestPrivKey'];
          privkey = this.credentials.getDerivedXPrivKey('').deriveChild('m/0/0').privateKey;

          const debug = !ENV.production;
          const [sig, ts] = this._signRequest(url, privkey, debug);

          headers['X-Pubkey'] = privkey.toPublicKey().toString();
          headers['X-Signature'] = sig;
          headers['X-Timestamp'] = ts;
          headers['X-Debug'] = debug;
        }
      }

      let r = this.request[method](this.baseUrl + url);

      r.accept('json');

      each(headers, function(v, k) {
        if (v) r.set(k, v);
      });

      if (args) {
        if (method == 'post' || method == 'put') {
          r.send(args);
        } else {
          r.query(args);
        }
      }

      r.ok(res => res.status < 500); // dont reject on failed status

      return Promise.resolve(r)
        .then(res => {
          if (res.status !== 200) {
            if (res.status === 404) return reject(MWCErrors.NOT_FOUND);

            if (res.code == MWCErrors.AUTHENTICATION_ERROR.code) {
              if (this.onAuthenticationError) this.onAuthenticationError();
              return reject(MWCErrors.AUTHENTICATION_ERROR);
            }

            if (!res.status) {
              return reject(MWCErrors.CONNECTION_ERROR);
            }

            this.log.error('HTTP Error:' + res.status);

            if (!res.body) return reject(new Error(res.status.toString()));

            return reject(this._parseError(res.body));
          }

          return resolve(res);
        })
        .catch(err => {
          if (!err.status) {
            return reject(MWCErrors.CONNECTION_ERROR);
          } else if (err.status == 502 || err.status == 504) {
            return reject(MWCErrors.SERVER_UNAVAILABLE);
          }

          if (!err.response || !err.response.text) {
            return reject(err);
          }

          let errObj; // not an instance of Error
          try {
            errObj = JSON.parse(err.response.text);
          } catch (e) {
            return reject(err);
          }

          if (errObj.code == MWCErrors.AUTHENTICATION_ERROR.code) {
            if (this.onAuthenticationError) {
              return Promise.resolve(this.onAuthenticationError());
            }
          }

          if (errObj.code && MWCErrors[errObj.code]) return reject(MWCErrors[errObj.code]);
          return reject(err);
        });
    });
  }

  /**
   * Parse errors
   * @private
   * @static
   * @memberof Client.API
   * @param {Object} body
   */
  private _parseError = (body: any): Error => {
    if (!body) return;

    if (isString(body)) {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {
          error: body,
        };
      }
    }
    let ret = new Error(body.error || JSON.stringify(body));
    this.log.error(ret);

    return ret;
  };

  /**
   * Sign an HTTP request
   *
   * @param {String} path - The URL for the request
   * @param {Bitcore.PrivateKey} privkey - Private key to sign the request
   * @param {boolean} debug - debug mode
   */
  private _signRequest = function(path, privkey, debug): [string, number] {
    const timestamp = Date.now();
    let message = path;

    if (!debug) {
      message += timestamp;
    }

    const signature = Bitcore.Message(message).sign(privkey);

    return [signature, timestamp];
  };
}
