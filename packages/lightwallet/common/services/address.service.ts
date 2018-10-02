import { Injectable } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { RateService } from '@merit/common/services/rate.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { ConfigService } from '@merit/common/services/config.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { isAddress, isAlias } from '@merit/common/utils/addresses';
import { ISendMethod } from '@merit/common/models/send-method';
import { Address, Referral } from 'meritcore-lib';

@Injectable()
export class AddressService {
  private readonly ADDRESS_LENGTH = 34;
  private client: MeritWalletClient;

  constructor(
    private rate: RateService,
    private config: ConfigService,
    private persistenceService: PersistenceService,
    private logger: LoggerService,
    mwcService: MWCService
  ) {
    this.client = mwcService.getClient(null);
  }

  isAddress(addr: string): boolean {
    return isAddress(addr);
  }

  couldBeAlias(alias: string): boolean {
    return Referral.validateAlias(alias);
  }

  getAddressInfo(addr: string) {
    if (isAlias(addr)) addr = addr.slice(1);
    return this.client.validateAddress(addr);
  }

  async getAddressInfoIfValid(addr: string) {
    const info = await this.getAddressInfo(addr);
    return info.isValid && info.isBeaconed && info.isConfirmed ? info : null;
  }

  async isAddressValid(addr: string): Promise<boolean> {
    if (!this.isAddress(addr)) {
      return false;
    }

    const info = await this.getAddressInfo(addr);

    return info.isValid && info.isBeaconed && info.isConfirmed;
  }

  async isAddressBeaconed(addr: string): Promise<boolean> {
    if (!this.isAddress(addr)) {
      return false;
    }

    const info = await this.getAddressInfo(addr);

    return info.isValid && info.isBeaconed;

  }

  async getValidAddress(input: string): Promise<string> {
    if (!(this.isAddress(input) || this.couldBeAlias(input))) {
      return null;
    }

    const info = await this.getAddressInfo(input);

    if (info && info.isConfirmed) {
      return info.address;
    }

    return null;
  }

  getAddressNetwork(addr) {
    return Address.fromString(addr).network;
  }

  async registerSend(method: ISendMethod) {
    return this.persistenceService.registerSend(method);
  }

  async getSendHistory() {
    let history = await this.persistenceService.getSendHistory();
    return history || [];
  }
}
