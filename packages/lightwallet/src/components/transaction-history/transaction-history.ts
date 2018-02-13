import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ITransaction, TransactionAction } from '../../models/transaction';

@Component({
  selector: 'transaction-history',
  templateUrl: 'transaction-history.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionHistoryComponent {
  @Input()
  transactions: ITransaction[];

  isUnlockRequest(transaction: ITransaction) {
    return transaction.action === TransactionAction.UNLOCK;
  }

  isCredit(transaction: ITransaction) {
    return transaction.action === TransactionAction.RECEIVED || transaction.action === TransactionAction.RECEIVING;
  }

  isDebit(transaction: ITransaction) {
    return transaction.action === TransactionAction.SENT || transaction.action === TransactionAction.SENDING;
  }

  isMiningReward(transaction: ITransaction) {
    return Boolean(transaction.isCoinbase) && transaction.outputs[0].index === 0;
  }

  isEasySend(transaction: ITransaction) {
    return !this.isMiningReward(transaction) && !this.isUnlockRequest(transaction);
  }

  isAmbassadorReward(transaction: ITransaction) {
    return Boolean(transaction.isCoinbase) && transaction.outputs[0].index !== 0;
  }
}
