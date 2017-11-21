import * as request from 'supertest';
import * as _ from 'lodash';
import * as sinon from 'sinon';
import * as tingodb from 'tingodb';
import { expect } from 'chai';
import * as promise from 'bluebird';

import { MeritWalletClient } from "../../src/lib/merit-wallet-client/index";
import { Common } from '../../src/lib/merit-wallet-client/lib/common';
import { BwcService } from './bwc.service';
import { MeritClient } from '../../src/lib/merit-wallet-client/lib/index';

const Utils = Common.Utils;
const Constants = Common.Constants;
const Bitcore = new BwcService().getBitcore();

export interface Helpers {
  toMicro: (merit: number) => number,
  newClient: (app: any) => MeritWalletClient,
  stubRequest: (err: Error, res: any) => Map<string, Object>,
  newDb: () => any,
  generateUtxos: (scriptType: string, publicKeyRing: any, path: any, requiredSignatures: any, amounts: number[]) => any,
  tamperResponse: (clients: MeritClient[], method: string, url: string, args, tamper) => Promise<MeritClient[]>,
  createAndPublishTxProposal: (client: MeritClient, opts: any) => any
}
export let helpers: Helpers = {
  toMicro: (mrt) => {
    return parseFloat((mrt * 1e8).toPrecision(12));
  },

  newClient: (app) => {
    expect(app).to.exist;
    return MeritWalletClient.getInstance({
      baseUrl: '/bws/api',
      request: request(app),
    });
  },

  stubRequest: (err, res) => {
    var request = {
      accept: sinon.stub(),
      set: sinon.stub(),
      query: sinon.stub(),
      send: sinon.stub(),
      timeout: sinon.stub(),
      end: sinon.stub().yields(err, res),
    };
    var reqFactory = _.reduce(['get', 'post', 'put', 'delete'], (mem, verb) => {
      mem[verb] = (url) => request;
      return mem;
    }, new Map<string, Object>());

    return reqFactory;
  },

  newDb: () => {
    this.dbCounter = (this.dbCounter || 0) + 1;
    let tdb = tingodb({memStore: true});
    return new tdb.Db('./db/test' + this.dbCounter, {});
  },

  generateUtxos: (scriptType, publicKeyRing, path, requiredSignatures, amounts) => {
    let utxos = _.map(amounts, function(amount, i) {

      var address = Utils.deriveAddress(scriptType, publicKeyRing, path, requiredSignatures, 'testnet');

      var scriptPubKey;
      switch (scriptType) {
        case Constants.SCRIPT_TYPES.P2SH:
          scriptPubKey = Bitcore.Script.buildMultisigOut(address.publicKeys, requiredSignatures).toScriptHashOut();
          break;
        case Constants.SCRIPT_TYPES.P2PKH:
          scriptPubKey = Bitcore.Script.buildPublicKeyHashOut(address.address);
          break;
      }
      expect(scriptPubKey).to.exist;

      var obj = {
        txid: Bitcore.crypto.Hash.sha256(new Buffer(i)).toString('hex'),
        vout: 100,
        micros: helpers.toMicro(amount),
        scriptPubKey: scriptPubKey.toBuffer().toString('hex'),
        address: address.address,
        path: path,
        publicKeys: address.publicKeys,
      };
      return obj;
    });
    return utxos;
  },

  tamperResponse: (clients, method, url, args, tamper) => {
    // Use first client to get a clean response from server
    return clients[0]._doRequest(method, url, args, false).then((result) => {
      tamper(result);
      // Return tampered data for every client in the list
      _.each(clients, (client) => {
        client._doRequest = sinon.stub().withArgs(method, url).yields(null, result);
      });
      return promise.resolve(clients);
    })
  },

  createAndPublishTxProposal: (client, opts) => {
    if (!opts.outputs) {
      opts.outputs = [{
        toAddress: opts.toAddress,
        amount: opts.amount,
      }];
    }
    return client.createTxProposal(opts).then((txp) => {
      return client.publishTxProposal({
        txp: txp
      });
    });
  },
}

