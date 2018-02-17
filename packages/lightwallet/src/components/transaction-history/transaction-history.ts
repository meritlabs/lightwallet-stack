import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { IDisplayTransaction, ITransaction, TransactionAction } from '../../models/transaction';
import { ContactsProvider } from '../../providers/contacts/contacts';
import { ModalController } from 'ionic-angular';
import { MERIT_MODAL_OPTS } from '../../utils/constants';

@Component({
  selector: 'transaction-history',
  templateUrl: 'transaction-history.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionHistoryComponent {
  @Input()
  transactions: IDisplayTransaction[];

  constructor(private modalCtrl: ModalController) {}

  viewTxDetails(tx: IDisplayTransaction) {
    return this.modalCtrl.create('TxDetailsView', { tx }, MERIT_MODAL_OPTS).present();
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
