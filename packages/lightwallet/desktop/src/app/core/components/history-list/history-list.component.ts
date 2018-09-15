import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ProgressStatus, TaskSlug } from '@merit/common/models/goals';
import { IDisplayTransaction, TransactionAction } from '@merit/common/models/transaction';
import { IRootAppState } from '@merit/common/reducers';
import { selectStatusForTask, SetTaskStatus } from '@merit/common/reducers/goals.reducer';
import { selectPrimaryWallet } from '@merit/common/reducers/interface-preferences.reducer';
import { getLatestDefinedValue, getLatestValue } from '@merit/common/utils/observables';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@Component({
  selector: 'history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class HistoryListComponent {
  private _transactions: IDisplayTransaction[];

  @Input()
  set transactions(val: IDisplayTransaction[]) {
    this._transactions = val;
    this.updateIsInviteMined();
  }

  get transactions(): IDisplayTransaction[] {
    return this._transactions;
  }

  @Input()
  showWalletName: boolean = true;

  @Input() loading: boolean;
  @Input() widget: boolean;

  viewPortItems: IDisplayTransaction[];
  mineInviteTaskSlug: TaskSlug = TaskSlug.MineInvite;
  unlockTaskSlug: TaskSlug = TaskSlug.UnlockWallet;
  isInviteMined$: Observable<boolean> = this.store.select(selectStatusForTask(this.mineInviteTaskSlug))
    .pipe(
      map((status: ProgressStatus) => status !== ProgressStatus.Incomplete)
    );
  isWalletUnlocked$: Observable<boolean> = this.store.select(selectPrimaryWallet)
    .pipe(
      map((wallet: DisplayWallet) => wallet && wallet.confirmed)
    );

  constructor(private store: Store<IRootAppState>) {}

  private async updateIsInviteMined() {
    if (await getLatestValue(this.isInviteMined$)) {
      return;
    }

    const primaryWallet = await getLatestDefinedValue(this.store.select(selectPrimaryWallet));

    if (this.transactions.some((tx: IDisplayTransaction) =>
      tx.action === TransactionAction.INVITE &&
      !tx.isWalletUnlock &&
      tx.walletId === primaryWallet.id
    )) {
      this.store.dispatch(new SetTaskStatus(this.mineInviteTaskSlug, ProgressStatus.Complete));
    }
  }
}
