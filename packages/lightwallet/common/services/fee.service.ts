import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ENV } from '@app/env';
import { MWCService } from '@merit/common/services/mwc.service';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';

@Injectable()
export class FeeService {
  public feeOpts: Object;
  private CACHE_TIME_TS: number;
  private cache: { updateTs: number, data: any };

  public static DEFAULT_FEE = 100000;

  constructor(private mwcService: MWCService,
              private configService: ConfigService,
              private logger: LoggerService) {
    this.feeOpts = {
      urgent: 'Urgent',
      priority: 'Priority',
      normal: 'Normal',
      economy: 'Economy',
      superEconomy: 'Super Economy',
      custom: 'Custom'
    };
    this.CACHE_TIME_TS = 60;
    this.cache = {
      updateTs: 0,
      data: {}
    };
  }

  getFeeOptValues(): Array<string> {
    return _.values(this.feeOpts);
  };

  getCurrentFeeLevel(): string {
    return this.configService.get().wallet.settings.feeLevel || 'normal';
  };

  getFeeRate(network: string, feeLevel: string): Promise<any> {
    this.logger.log('getFeeRate called', network, feeLevel);
    if (feeLevel == 'custom') return Promise.resolve();
    let self = this;

    network = network || ENV.network;

    return this.getFeeLevel(network, feeLevel).then((levelData: { data: { level: string, feePerKb: number }, fromCache: Boolean }) => {
      let feeLevelRate = levelData.data
      this.logger.log('feeLevelRate is', feeLevelRate)
      if (!feeLevelRate || !feeLevelRate.feePerKb) {
        this.logger.error('failed in getFeeLevel', feeLevelRate)
        return Promise.reject(new Error(`Could not get dynamic fee for level: ${feeLevel} on network ${network}`));
      }
      let feeRate = feeLevelRate.feePerKb;
      if (!levelData.fromCache) self.logger.debug('Dynamic fee: ' + feeLevel + '/' + network + ' ' + (feeLevelRate.feePerKb / 1000).toFixed() + ' Micros/B');
      return Promise.resolve(feeRate);
    });
  };

  getWalletFeeRate(wallet, feeLevel) {

    return wallet.getFeeLevels(wallet.network).then((levels) => {
      this.cache.updateTs = Date.now();
      this.cache.data = _.find(levels, {
        level: feeLevel
      });
      return Promise.resolve({ data: this.cache.data, fromCache: false });
    });

  }

  getCurrentFeeRate(network: string) {
    return this.getFeeRate(network, this.getCurrentFeeLevel());
  }

  getFeeLevels(network) {
    const walletClient = this.mwcService.getClient(null);
    return walletClient.getFeeLevels(network);
  }

  async getFeeLevel(network: string, feeLevel: string): Promise<{ data: { level: string, feePerKb: number }, fromCache: Boolean }> {
    if (this.cache.updateTs > Date.now() - this.CACHE_TIME_TS * 1000) {
      return { data: this.cache.data, fromCache: true };
    } else {
      let walletClient = this.mwcService.getClient(null);
      const levels = await walletClient.getFeeLevels(network);
      this.cache.updateTs = Date.now();
      this.cache.data = _.find(levels, {
        level: feeLevel
      });
      return { data: this.cache.data, fromCache: false };
    }
  }

  public async getTxpFee(txp) {

    console.log(txp.serialize().length, 'TXP size');  

    const feePerKB = await this.getCurrentFeeRate(ENV.network);
    const fee = Math.round(feePerKB * txp.serialize().length / 1024);
    return fee; 
  }

  public async getEasyReceiveFee() {
    //todo TEMP! MOVE THIS TO MWS
    return Promise.resolve(100000);     
  }


}
