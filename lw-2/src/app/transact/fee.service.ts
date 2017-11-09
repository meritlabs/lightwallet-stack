import { Injectable } from '@angular/core';
import { BwcService } from 'merit/core/bwc.service';
import { ConfigService } from 'merit/shared/config.service';
import { Logger } from 'merit/core/logger';

import { Promise } from 'bluebird';
import * as _ from 'lodash';

@Injectable()
export class FeeService {
  private CACHE_TIME_TS: number;
  private cache: {data: Object, updateTs: number};
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
  }

  getCurrentFeeLevel() {
    return this.configService.get().wallet.settings.feeLevel || 'normal';
  };

  getFeeRate(network, feeLevel) {
    if (feeLevel == 'custom') return Promise.resolve();
    let self = this;

    network = network || 'livenet';

    return this.getFeeLevel(network).then((levels) => {
      var feeLevelRate: any = _.find(levels.data[network], {
        level: feeLevel
      });
      if (!feeLevelRate || !feeLevelRate.feePerKb) {
        return Promise.reject({
          message: `Could not get dynamic fee for level: ${feeLevel} on network ${network}`
        });
      }
      var feeRate = feeLevelRate.feePerKB;
      if (!levels.fromCache) self.logger.debug('Dynamic fee: ' + feeLevel + '/' + network + ' ' + (feeLevelRate.feePerKb / 1000).toFixed() + ' Micros/B');
      return feeRate;
    });
  };

  getCurrentFeeRate(network) {
    return this.getFeeRate(network, this.getCurrentFeeLevel());
  };

  getFeeLevel(network): Promise<{data: Object, fromCache: Boolean}> {

    if (this.cache.updateTs > Date.now() - this.CACHE_TIME_TS * 1000) {
      return Promise.resolve({data: this.cache.data, fromCache: true});
    }

    // We should ge the default BWS URL for now.  
    var opts = {
      bwsurl: this.configService.getDefaults().bws.url
    };
    const walletClient = this.bwcService.getClient(null, opts);

    walletClient.getFeeLevels(network, function(err, level) {
      if (err) {
        return Promise.reject({message: 'Could not get dynamic fee'});
      }

      this.cache.updateTs = Date.now();
      this.cache.data = this.cache.data || {};
      this.cache.data[network] = level;

      return Promise.resolve({data: this.cache.data, fromCache: false});
    });
  };
}