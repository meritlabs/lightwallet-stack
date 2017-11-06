import { Injectable } from '@angular/core';
import { Promise } from 'bluebird';
import { Logger } from 'merit/core/logger';
import { BwcService } from 'merit/core/bwc.service';
import { ConfigService } from 'merit/shared/config.service';
import { ProfileService } from 'merit/core/profile.service';
import { PersistenceService } from 'merit/core/persistence.service';
import { TransactionProposal } from 'merit/transact/transaction-proposal.model';
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

  public subscribe(client, subject: TransactionProposal | Referral): Promise<any> {
    let methodPrefix = this.getMethodPrefix(subject);
    
    //TODO: Rewrite BWC with promises.
    let subCall = Promise.promisify(client[methodPrefix + 'ConfirmationSubscribe'](subject.id, {}, function(){}));
    return subCall.then((res) => {
      this.storageService['set' + methodPrefix + 'confirmNotification'](subject.id, true, cb())
    });
  }

  /**
   * Returns the method prefix used further down the stack. 
   * Today, we only have confirmation events, but it stands to 
   * reason that we'll add more in the future.  
   * @param subject - TransactionProposal or Referral
   */
  private getMethodPrefix(subject: TransactionProposal | Referral): string {
    // Switch statements don't work on types yet in TypeScript.  
    // Using ifs for now.
    if (<TransactionProposal>subject) {
      return 'tx';
    }
    if (<Referral>subject) {
      return 'ref';
    }
    // Should never get here because of union type.  
    let n: never;
    return n;
  }

  // export class NotificationSubject {
  //   subscribe(client: any, opts: any): Promise<any>;
  //   unsubcribe(client: any, id: string): Promise<any>;
  //   subscriptionExists(id: string): Promise<boolean>;
  // }

  // export class TxNotification {

  // }

  
}

