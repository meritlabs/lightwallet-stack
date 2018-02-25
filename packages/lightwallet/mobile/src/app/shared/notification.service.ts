import { Injectable } from '@angular/core';
import { Referral } from '@merit/mobile/app/community/referral.model';
import { BwcService } from '@merit/mobile/app/core/bwc.service';

import { Logger } from '@merit/mobile/app/core/logger';
import { PersistenceService } from '@merit/mobile/app/core/persistence.service';
import { ProfileService } from '@merit/mobile/app/core/profile.service';
import { ConfigService } from '@merit/mobile/app/shared/config.service';
import { TransactionProposal } from '@merit/mobile/app/transact/transaction-proposal.model';

type Subject = TransactionProposal | Referral

/**
 * This service allows you to subscribe and unsubscribe
 * from notifications on an object.
 */

@Injectable()
export class NotificationService {

  private errors: any = this.bwcService.getErrors();

  constructor(private logger: Logger,
              private bwcService: BwcService,
              private configService: ConfigService,
              private profileService: ProfileService,
              private persistenceService: PersistenceService) {
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
