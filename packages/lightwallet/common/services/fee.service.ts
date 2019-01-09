import { Injectable } from '@angular/core';
import { ENV } from '@app/env';

import { MWCService } from '@merit/common/services/mwc.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

export class FeeLevels {
  static URGENT = 'urgent';
  static PRIORITY = 'priority';
  static NORMAL = 'normal';
  static ECONOMY = 'economy';
  static SUPER_ECONOMY = 'superEconomy';
}

@Injectable()
export class FeeService {
  public mwClient: MeritWalletClient;

  public static DEFAULT_FEE = 10000;

  private readonly CACHE_TIME = 120000; //2min
  private cache = { updatedTs: 0, levels: [] };

  constructor(mwcService: MWCService) {
    this.mwClient = mwcService.getClient(null);
  }

  /**
   * Returns fee rate for selected level and caches it for selected time
   */
  public async getFeeRate(levelName) {
    if (this.cache.updatedTs + this.CACHE_TIME < Date.now()) {
      const levels = await this.mwClient.getFeeLevels(ENV.network);
      this.cache = { updatedTs: Date.now(), levels };
    }

    return this.cache.levels.find(l => l.level == levelName).feePerKb;
  }

  /**
   * Calculates fee for txp based on transaction size
   */
  public async getTxpFee(txp) {
    const feePerKB = await this.getFeeRate(ENV.feeLevel);
    const fee = Math.round((feePerKB * txp.serialize().length) / 1024);
    return fee;
  }

  /**
   * Get fee for easy receive
   * fees for easy receive transactions are fixed and received from MWS side
   */
  public getEasyReceiveFee() {
    return this.mwClient.getEasyReceiveFee();
  }

  /**
   * returns fee level set throughout the app
   */
  public getCurrentFeeLevel() {
    return ENV.feeLevel;
  }
}
