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

  isUnlockRequest(transaction: IDisplayTransaction) {
    return transaction.action === TransactionAction.UNLOCK;
  }

  isCredit(transaction: IDisplayTransaction) {
    return transaction.isCoinbase || transaction.action === TransactionAction.RECEIVED;
  }

  isInvite(transaction: IDisplayTransaction) {
    return transaction.isInvite === true;
  }

  isDebit(transaction: IDisplayTransaction) {
    return transaction.action === TransactionAction.SENT;
  }

  isMiningReward(transaction: IDisplayTransaction) {
    return this.isReward(transaction) && transaction.outputs[0].index === 0;
  }

  isEasySend(transaction: IDisplayTransaction) {
    return !transaction.isCoinbase && !transaction.isInvite;
  }

  isAmbassadorReward(transaction: IDisplayTransaction) {
    return transaction.isAmbassadorReward;
  }

  private isReward(transaction: IDisplayTransaction) {
    try {
      return Boolean(transaction.isCoinbase) && transaction.outputs[0] && !isNaN(transaction.outputs[0].index) && !transaction.isInvite;
    } catch (e) {
      return false;
    }
  }
}
