import { Injectable } from '@angular/core';
import { Promise } from 'bluebird';
import { Logger } from 'merit/core/logger';
import { BwcService } from 'merit/core/bwc.service';
import { ConfigService } from 'merit/shared/config.service';
import { ProfileService } from 'merit/core/profile.service';
import { PersistenceService } from 'merit/core/persistence.service';
import { Transaction } from 'merit/transact/transaction.model';
import { Referral } from 'merit/community/referral.model';



import * as _ from 'lodash';

/**
 * This service allows you to subscribe and unsubscribe 
 * from notifications on an object.
 */

@Injectable()
export class NotificationService {

  private errors: any = this.bwcService.getErrors();
  
  constructor(
    private logger: Logger,
    private bwcService: BwcService,
    private configService: ConfigService,
    private profileService: ProfileService,
    private persistenceService: PersistenceService
  ) {
    console.log('Hello Notification Service');
  }

  public subscribe(client, subject: Transaction | Referral): Promise<any> {
    let methodPrefix = this.getMethodPrefix(subject);
    
    //TODO: Rewrite BWC with promises.
    client[methodPrefix + 'subscribe'](subject.id, {}, function(){});
    
  }

  /**
   * Returns the method prefix used further down the stack. 
   * Today, we only have confirmation events, but it stands to 
   * reason that we'll add more in the future.  
   * @param subject - Transaction or Referral
   */
  private getMethodPrefix(subject: Transaction | Referral): string {
    // Switch statements don't work on types yet in TypeScript.  
    // Using ifs for now.
    if (<Transaction>subject) {
      return 'txConfirmation';
    }
    if (<Referral>subject) {
      return 'refConfirmation';
    }
    // Should never get here because of union type.  
  }

  // export class NotificationSubject {
  //   subscribe(client: any, opts: any): Promise<any>;
  //   unsubcribe(client: any, id: string): Promise<any>;
  //   subscriptionExists(id: string): Promise<boolean>;
  // }

  // export class TxNotification {

  // }

  
}

