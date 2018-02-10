import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ITransaction, TransactionAction } from '../../models/transaction';
import { ContactsProvider } from '../../providers/contacts/contacts';

@Component({
  selector: 'transaction-history',
  templateUrl: 'transaction-history.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionHistoryComponent {
  @Input()
  transactions: ITransaction[];

  constructor(private contacts: ContactsProvider) {}

  getContact(transaction: ITransaction) {
    return null;
    // return this.contacts.get(transaction);
  }

  isUnlockRequest(transaction: ITransaction) {
    return transaction.action === TransactionAction.UNLOCK;
  }

  isCredit(transaction: ITransaction) {
    return transaction.action === TransactionAction.RECEIVED;
  }

  isInvite(transaction: ITransaction) {
    return transaction.isInvite === true;
  }

  isDebit(transaction: ITransaction) {
    return transaction.action === TransactionAction.SENT;
  }

  isMiningReward(transaction: ITransaction) {
    return this.isReward(transaction) && transaction.outputs[0].index === 0;
  }

  isEasySend(transaction: ITransaction) {
    return !this.isInvite(transaction) && !this.isReward(transaction);
  }

  isAmbassadorReward(transaction: ITransaction) {
    return this.isReward(transaction) && transaction.outputs[0].index > 0;
  }

  private isReward(transaction: ITransaction) {
    try {
      return Boolean(transaction.isCoinbase) && transaction.outputs[0] && !isNaN(transaction.outputs[0].index);
    } catch (e) {
      return false;
    }
  }
}
