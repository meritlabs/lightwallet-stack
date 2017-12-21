import { Injectable } from '@angular/core';
import { BwcService } from 'merit/core/bwc.service';
import { ConfigService } from 'merit/shared/config.service';
import { Logger } from 'merit/core/logger';

import * as Promise from 'bluebird';
import * as _ from 'lodash';

@Injectable()
export class FeeService {
  private CACHE_TIME_TS: number;
  private cache: {updateTs: number, data: any};
  public feeOpts: Object;

  constructor(
    private bwcService: BwcService,
    private configService: ConfigService,
    private logger: Logger
  ) {
    this.feeOpts = {
      urgent: 'Urgent',
      priority: 'Priority',
      normal: 'Normal',
      economy: 'Economy',
      superEconomy: 'Super Econoy',
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

    network = network || this.configService.getDefaults().network.name;

    return this.getFeeLevel(network, feeLevel).then((levelData: {data: {level: string, feePerKb: number}, fromCache: Boolean}) => {
      let feeLevelRate = levelData.data
      this.logger.log('feeLevelRate is', feeLevelRate)
      if (!feeLevelRate || !feeLevelRate.feePerKb) {
        this.logger.error('failed in getFeeLevel', feeLevelRate)
        return Promise.reject({
          message: `Could not get dynamic fee for level: ${feeLevel} on network ${network}`
        });
      }
      let feeRate = feeLevelRate.feePerKb;
      if (!levelData.fromCache) self.logger.debug('Dynamic fee: ' + feeLevel + '/' + network + ' ' + (feeLevelRate.feePerKb / 1000).toFixed() + ' Micros/B');
      return Promise.resolve(feeRate);
    });
  };

  getWalletFeeRate(wallet, feeLevel) {

    return new Promise((resolve, reject) => {
      return wallet.getFeeLevels(wallet.network).then((levels) => {
        this.cache.updateTs = Date.now();
        this.cache.data = _.find(levels, {
          level: feeLevel
        });
        return resolve({data: this.cache.data, fromCache: false})
      }).catch((err) => {
        return reject(err);
      });
    });

  }

  getCurrentFeeRate(network: string) {
    return this.getFeeRate(network, this.getCurrentFeeLevel());
  };

  getFeeLevel(network: string, feeLevel: string): Promise<{data: {level: string, feePerKb: number}, fromCache: Boolean}> {

    return new Promise((resolve, reject) => {

      if (this.cache.updateTs > Date.now() - this.CACHE_TIME_TS * 1000) {
        return resolve({data: this.cache.data, fromCache: true});
      } else {


        let walletClient = this.bwcService.getClient(null);

        return walletClient.getFeeLevels(network).then((levels) => {
          this.cache.updateTs = Date.now();
          this.cache.data = _.find(levels, {
            level: feeLevel
          });
          return resolve({data: this.cache.data, fromCache: false})
        }).catch((err) => {
          return reject(err);
        })
      }
    });

  };
}
