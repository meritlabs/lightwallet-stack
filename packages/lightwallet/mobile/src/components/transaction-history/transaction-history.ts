import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { IDisplayTransaction, TransactionAction } from '@merit/common/models/transaction';

@Component({
  selector: 'transaction-history',
  templateUrl: 'transaction-history.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    return transaction.isCoinbase || transaction.isPoolReward || transaction.action === TransactionAction.RECEIVED;
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

  isPoolReward(transaction: IDisplayTransaction) {
    return transaction.isPoolReward;
  }

  isEasySend(transaction: IDisplayTransaction) {
    return !!transaction.easySendUrl;
  }

  isGrowthReward(transaction: IDisplayTransaction) {
    return transaction.isGrowthReward;
  }

  isRegularTx(transaction: IDisplayTransaction) {
    return (
      !transaction.isGrowthReward &&
      !transaction.easySendUrl &&
      !transaction.isPoolReward &&
      !transaction.isInvite &&
      !transaction.isCoinbase
    );
  }

  private isReward(transaction: IDisplayTransaction) {
    try {
      return (
        Boolean(transaction.isCoinbase) &&
        transaction.outputs[0] &&
        !isNaN(transaction.outputs[0].index) &&
        !transaction.isInvite
      );
    } catch (e) {
      return false;
    }
  }
}
