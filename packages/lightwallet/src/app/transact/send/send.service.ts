import { Injectable } from '@angular/core';
import { BwcService } from 'merit/core/bwc.service';
import { Logger } from 'merit/core/logger';
import { PersistenceService } from 'merit/core/persistence.service';
import { ConfigService } from 'merit/shared/config.service';
import { RateService } from 'merit/transact/rate.service';

/*
 Service to help manage sending merit to others.
 */
@Injectable()
export class SendService {
  private bitcore: any;

  private readonly ADDRESS_LENGTH = 34;

  constructor(
    private bwcService: BwcService,
    private rate: RateService,
    private config: ConfigService,
    private persistenceService: PersistenceService,
    private logger: Logger
  ) {
    this.logger.info('Hello SendService');
    this.bitcore = this.bwcService.getBitcore();
  }

  public isAddress(addr: string): boolean {
    try {
      let address = this.bitcore.Address.fromString(addr);
      return true;
    } catch (_e) {
      return false;
    }
  }

  public couldBeAlias(alias: string): boolean {
    return this.bitcore.Referral.validateAlias(alias);
  }

  public async isAddressValid(addr: string): Promise<boolean> {
    if (!this.isAddress(addr)) {
      return false;
    }

    const info = await this.bwcService.getClient(null, {}).validateAddress(addr);

    return info.isValid && info.isBeaconed && info.isConfirmed;
  }

  public async getValidAddress(input: string): Promise<string> {
    if (!(this.isAddress(input) || this.couldBeAlias(input))) {
      return null;
    }

    const info = await this.bwcService.getClient(null, {}).validateAddress(input);

    if (info && info.isConfirmed) {
      return info.address;
    }

    return null;
  }

  public getAddressNetwork(addr) {
    return this.bitcore.Address.fromString(addr).network;
  }

  public async registerSend(contact, method) {
    return this.persistenceService.registerSend(contact, method);
  }

  public async getSendHistory() {
    let history = await this.persistenceService.getSendHistory();
    return history || [];
  }

}
