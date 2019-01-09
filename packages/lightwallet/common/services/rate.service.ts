import { MeritWalletClient } from '@merit/common/merit-wallet-client';

export class RateService {
  private readonly CACHE_TIME = 120000; //2min
  public mwClient: MeritWalletClient;
  private MRT_TO_MIC = 1e8;

  private cache: {
    updatedTs: number;
    rates: Array<{
      code: string;
      name: string;
      rate: number;
    }>;
  };

  /**
   * setting mwClient 'cause we receive rates from MWS
   * @param mwcService
   */
  constructor() {
    this.cache = { updatedTs: 0, rates: [] };
    this.mwClient = MeritWalletClient.getInstance({});
  }

  /**
   * loads rates and saves them to cache
   * @returns {*}
   */
  async loadRates() {
    const rates = await this.mwClient.getRates();
    this.cache = { updatedTs: Date.now(), rates };
    return rates;
  }

  /**
   * gets rate for provided currency, loads fresh rates if needed
   * @param code - fiat code; example: USD
   * @param [forceLoad] {boolean}
   * @returns {number}
   */
  async getRate(code, forceLoad?: boolean) {
    let rates = this.cache.rates;
    if (forceLoad || this.cache.updatedTs + this.CACHE_TIME < Date.now()) {
      rates = await this.loadRates();
    }
    let unit = rates.find(l => l.code == code);
    return unit ? unit.rate : 0;
  }

  /**
   * list available fiat currencies
   */
  async getAvailableFiats() {
    let rates = this.cache.rates;
    if (this.cache.updatedTs + this.CACHE_TIME < Date.now()) {
      rates = await this.loadRates();
    }
    return rates.filter(r => r.rate > 0);
  }

  mrtToMicro(mrt) {
    return Math.round(mrt * this.MRT_TO_MIC);
  }

  microsToMrt(micros) {
    return parseFloat((micros / this.MRT_TO_MIC).toFixed(8));
  }

  async microsToFiat(micros: number, code: string): Promise<number> {
    const rate = await this.getRate(code);
    return this.microsToMrt(micros) * rate;
  }

  async fiatToMicros(amount: number, code: string): Promise<number> {
    const rate = await this.getRate(code);
    return Math.ceil((amount / rate) * this.MRT_TO_MIC);
  }

  /**
   * @OBSOLETE Remove this after removing usages of this method
   *
   * @param micros
   * @param code
   * @returns {number}
   */
  fromMicrosToFiat(micros: number, code: string) {
    const r = this.cache.rates.find(l => l.code == code) || { rate: 0 };
    return this.microsToMrt(micros) * r.rate;
  }

  /**
   * @OBSOLETE Remove this after removing usages of this method
   *
   * @param amount
   * @param code
   * @returns {number}
   */
  fromFiatToMicros(amount: number, code: string) {
    const r = this.cache.rates.find(l => l.code == code) || { rate: 0 };
    return Math.ceil((amount / r.rate) * this.MRT_TO_MIC);
  }
}
