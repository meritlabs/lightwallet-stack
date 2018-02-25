import { Injectable } from '@angular/core';
import { BwcService } from '@merit/mobile/app/core/bwc.service';
import { Logger } from '@merit/mobile/app/core/logger';
import { PersistenceService } from '@merit/mobile/app/core/persistence.service';
import { ConfigService } from '@merit/mobile/app/shared/config.service';
import { RateService } from '@merit/mobile/app/transact/rate.service';
import { MeritWalletClient } from "merit/../lib/merit-wallet-client/index";
import { ISendMethod } from '@merit/mobile/app/transact/send/send-method.model';
import { isAlias } from '../../../utils/addresses';

/*
 Service to help manage sending merit to others.
 */
@Injectable()
export class SendService {
  private bitcore: any;

  private readonly ADDRESS_LENGTH = 34;

  private client:MeritWalletClient;

  constructor(
    private bwcService: BwcService,
    private rate: RateService,
    private config: ConfigService,
    private persistenceService: PersistenceService,
    private logger: Logger
  ) {
    this.logger.info('Hello SendService');
    this.bitcore = this.bwcService.getBitcore();
    this.client = this.bwcService.getClient(null, {});
  }

  public isAddress(addr: string): boolean {
    try {
      this.bitcore.Address.fromString(addr);
      return true;
    } catch (_e) {
      return false;
    }
  }

  public couldBeAlias(alias: string): boolean {
    return this.bitcore.Referral.validateAlias(alias);
  }

  public getAddressInfo(addr: string) {
    if (isAlias(addr)) addr = addr.slice(1);
    return this.client.validateAddress(addr);
  }

  async getAddressInfoIfValid(addr: string) {
    const info = await this.getAddressInfo(addr);
    return info.isValid && info.isBeaconed && info.isConfirmed ? info : null;
  }

  public async isAddressValid(addr: string): Promise<boolean> {
    if (!this.isAddress(addr)) {
      return false;
    }

    const info = await this.getAddressInfo(addr);

    return info.isValid && info.isBeaconed && info.isConfirmed;
  }

  public async isAddressBeaconed(addr: string): Promise<boolean> {
    if (!this.isAddress(addr)) {
      return false;
    }

    const info = await this.getAddressInfo(addr);

    return info.isValid && info.isBeaconed;

  }

  public async getValidAddress(input: string): Promise<string> {
    if (!(this.isAddress(input) || this.couldBeAlias(input))) {
      return null;
    }

    const info = await this.getAddressInfo(input);

    if (info && info.isConfirmed) {
      return info.address;
    }

    return null;
  }

  public getAddressNetwork(addr) {
    return this.bitcore.Address.fromString(addr).network;
  }

  public async registerSend(method: ISendMethod) {
    return this.persistenceService.registerSend(method);
  }

  public async getSendHistory() {
    let history = await this.persistenceService.getSendHistory();
    return history || [];
  }

}
