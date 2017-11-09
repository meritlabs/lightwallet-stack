import { Injectable } from '@angular/core';
import { BwcService } from 'merit/core/bwc.service';
import { RateService } from 'merit/transact/rate.service';
import { ConfigService } from 'merit/shared/config.service';
import { FiatAmount } from 'merit/shared/fiat-amount.model';
import { Logger } from 'merit/core/logger';

import { Promise } from 'bluebird';

import * as _ from "lodash";

/* 
  Service to help manage sending merit to others.
*/ 
@Injectable()
export class SendService {
  private bitcore: any;

  constructor(
    private bwcService: BwcService,
    private rate: RateService,
    private config: ConfigService,    
    private logger: Logger    
  ) {
    console.log('Hello SendService');
    this.bitcore = this.bwcService.getBitcore();
  }

  public isAddressValid(addr: string): Promise<boolean> {
    // First, let's check to be sure it's the right format.
    if (this.bitcore.Address.isValid(addr, 'testnet')) {
      // If it is, then let's be sure it's beaconed.
      return this.isAddressUnlocked(addr);
    } else { 
      return Promise.resolve(false);
    }
  }
  
  private isAddressUnlocked(addr: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const walletClient = this.bwcService.getClient(null, {});
      
      walletClient.validateAddress(addr, "testnet").then((result) => {
        if (!result) {
          reject(new Error("Could not validateAddress"));
        } else {
          const isAddressBeaconed = result.isValid && result.isBeaconed;
          resolve(isAddressBeaconed);
        }
      });
    });

  }
}



