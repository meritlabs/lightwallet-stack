import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { IDisplayTransaction, TransactionAction } from '@merit/common/models/transaction';
import { DEFAULT_HISTORY_FILTERS, IHistoryFilters } from '../../../../common/models/transaction';

const LIMIT_STEP = 25;

@Component({
  selector: 'transaction-history',
  templateUrl: 'transaction-history.html',
})
export class TransactionHistoryComponent implements OnChanges {
  limit: number = LIMIT_STEP;
  filteredTransactions: IDisplayTransaction[] = [];
  filters: IHistoryFilters = { ...DEFAULT_HISTORY_FILTERS };

  @Input()
  transactions: IDisplayTransaction[] = [];

  constructor(private modalCtrl: ModalController) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('filters')) {
      this.limit = LIMIT_STEP;
      return;
    }

    if (changes.hasOwnProperty('limit') || changes.hasOwnProperty('transactions')) {
      this.updateTransactions();
    }
  }

  private updateTransactions() {
    const filteredTransactions = this.transactions.filter(tx => this.filters[tx.action]);
    this.filteredTransactions = filteredTransactions.splice(0, this.limit);
  }

  loadMore(ev: any) {
    this.limit = Math.min(this.transactions.length, this.limit + LIMIT_STEP);
    this.updateTransactions();
    ev.complete();
  }

  trackByFn(index: number, item: IDisplayTransaction) {
    return item ? item.txid : undefined;
  }

  viewTxDetails(tx: IDisplayTransaction) {
    return this.modalCtrl.create('TxDetailsView', { tx }, MERIT_MODAL_OPTS).present();
  }

  isConfirmed(tx: IDisplayTransaction) {
    return !tx.isCoinbase || tx.confirmations > 101;
  }

  isUnlockRequest(transaction: IDisplayTransaction) {
    return transaction.action === TransactionAction.UNLOCK;
  }

  isCredit(transaction: IDisplayTransaction) {
    return transaction.type === 'credit';
  }


  isInvite(transaction: IDisplayTransaction) {
    return transaction.isInvite;
  }

  isDebit(transaction: IDisplayTransaction) {
    return transaction.action === TransactionAction.SENT;
  }

  isMiningReward(transaction: IDisplayTransaction) {
    return this.isReward(transaction) && transaction.outputs[0].n === 0;
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
    return !transaction.isGrowthReward && !transaction.easySendUrl && !transaction.isPoolReward && !transaction.isInvite && !transaction.isCoinbase;
  }

  private isReward(transaction: IDisplayTransaction) {
    try {
      return Boolean(transaction.isCoinbase) && transaction.outputs[0] && !isNaN(transaction.outputs[0].n) && !transaction.isInvite;
    } catch (e) {
      return false;
    }
  }
}
