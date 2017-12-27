import { Injectable } from '@angular/core';

import { Logger } from 'merit/core/logger';
import { BwcService } from 'merit/core/bwc.service';
import { ConfigService } from 'merit/shared/config.service';
import { ProfileService } from 'merit/core/profile.service';
import { PersistenceService } from 'merit/core/persistence.service';
import { TransactionProposal } from 'merit/transact/transaction-proposal.model';
import { Referral } from 'merit/community/referral.model';

import * as _ from 'lodash';

type Subject = TransactionProposal | Referral
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
    this.logger.info('Hello Notification Service');
  }

  public subscribe(client, subject: Subject): Promise<any> {
    let methodPrefix = this.getMethodPrefix(subject);
    if (!subject || !subject.id) {
      return Promise.reject(new Error('Missing subject'));
    }

    //TODO: Rewrite BWC with promises.

    // let subCall = Promise.promisify(client[methodPrefix + 'ConfirmationSubscribe'](subject.id, {}, function(){}));
    // return subCall().then((res) => {
    //   Promise.resolve(this.persistenceService.setTxConfirmNotification(subject.id, subject));
    // });
  }

  /**
   * Returns the method prefix used further down the stack.
   * Today, we only have confirmation events, but it stands to
   * reason that we'll add more in the future.
   * @param subject - TransactionProposal or Referral
   */
  private getMethodPrefix(subject: Subject): string {
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
