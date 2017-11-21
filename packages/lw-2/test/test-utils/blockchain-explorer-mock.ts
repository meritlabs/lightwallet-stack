import * as _ from 'lodash';
import * as Promise from 'bluebird';
import { expect } from 'chai';

import { Common } from '../../src/lib/merit-wallet-client/lib/common';
import { BwcService } from './bwc.service';
import { MeritClient } from '../../src/lib/merit-wallet-client/lib/index';

const Utils = Common.Utils;
const Constants = Common.Constants;
const Bitcore = new BwcService().getBitcore();

type Utxo = {
  txid: string,
  vout: number,
  amount: number,
  address: any,
  scriptPubKey: string,
  confirmations: number
}
export class BlockchainExplorerMock implements BlockchainExplorerMock {
  private utxos: Utxo[];
  private lastBroadcasted: any;
  private txHistory: any[];
  private feeLevels: any[];

  constructor() {
    this.lastBroadcasted = null;
    this.reset();
  }

  public getUtxos(addresses: any[]): Promise<any[]> {
    var selected = _.filter(this.utxos, (utxo) => {
      return _.includes(addresses, utxo.address);
    });
    return Promise.resolve(selected);
  };

  public setUtxo(address, amount, m, confirmations): void {
    var scriptPubKey;
    switch (address.type) {
      case Constants.SCRIPT_TYPES.P2SH:
        scriptPubKey = address.publicKeys ? Bitcore.Script.buildMultisigOut(address.publicKeys, m).toScriptHashOut() : '';
        break;
      case Constants.SCRIPT_TYPES.P2PKH:
        scriptPubKey = Bitcore.Script.buildPublicKeyHashOut(address.address);
        break;
    }
    expect(scriptPubKey).to.exist;
    this.utxos.push({
      txid: Bitcore.crypto.Hash.sha256(new Buffer(Math.random() * 100000)).toString('hex'),
      vout: Math.floor((Math.random() * 10) + 1),
      amount: amount,
      address: address.address,
      scriptPubKey: scriptPubKey.toBuffer().toString('hex'),
      confirmations: _.isUndefined(confirmations) ? Math.floor((Math.random() * 100) + 1) : +confirmations,
    });
  };

  public broadcast(raw): Promise<string> {
    this.lastBroadcasted = raw;
    return Promise.resolve(new Bitcore.Transaction(raw).id);
  };

  public setHistory(txs: any[]): void {
    this.txHistory = txs;
  };

  public getTransactions(from: number, to: number): Promise<any[]> {
    return Promise.resolve(_.slice(this.txHistory, from, to));
  };

  public getAddressActivity(address) {
    var activeAddresses = _.map(this.utxos, 'address');
    return Promise.resolve(_.includes(activeAddresses, address));
  };

  public setFeeLevels(levels: any[]): void {
    this.feeLevels = levels;
  };

  public estimateFee(nbBlocks, cb) {
    var levels = {};
    _.each(nbBlocks, (nb) => {
      var feePerKb = this.feeLevels[nb];
      levels[nb] = _.isNumber(feePerKb) ? feePerKb / 1e8 : -1;
    });

    return Promise.resolve(levels);
  };

  public reset(): void {
    this.utxos = [];
    this.txHistory = [];
    this.feeLevels = [];
  };
}




