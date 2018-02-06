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

  public isAddress(addr:string): boolean {
    if (!addr || addr.length != this.ADDRESS_LENGTH) return false;

    try {
      let address = this.bitcore.Address.fromString(addr);
      return true; 
    } catch (_e) {
      return false;
    }  
  }

  public isAddressValid(addr: string): Promise<boolean> {
    try {
        if (!this.isAddress(addr)) return Promise.resolve(false);
        let network = this.getAddressNetwork(addr); 
        return this.isAddressUnlocked(addr, network);
      return Promise.resolve(false);
    } catch (_e) {
      return Promise.resolve(false);
    }
  }

  public getAddressNetwork(addr) {
    return this.bitcore.Address.fromString(addr).network;
  }

  private isAddressUnlocked(addr: string, network: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const walletClient = this.bwcService.getClient(null, {});

      walletClient.validateAddress(addr, network).then((result) => {
        if (!result) {
          reject(new Error('Could not validateAddress'));
        } else {
          const isAddressBeaconed = result.isValid && result.isBeaconed;
          resolve(isAddressBeaconed);
        }
      });
    });
  }

  public async registerSend(contact, method) {
    return this.persistenceService.registerSend(contact, method);
  }

  public async getSendHistory() {
    let history = await this.persistenceService.getSendHistory();
    return history || [];
  }

}
