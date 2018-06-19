import { ChangeDetectionStrategy, Component, ElementRef, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ProgressStatus, TaskSlug } from '@merit/common/models/goals';
import { IDisplayTransaction, TransactionAction } from '@merit/common/models/transaction';
import { IRootAppState } from '@merit/common/reducers';
import { SetTaskStatus } from '@merit/common/reducers/goals.reducer';
import { GoalsService } from '@merit/common/services/goals.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
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

  @Input() loading: boolean;
  @Input() widget: boolean;

  viewPortItems: IDisplayTransaction[];
  isInviteMined: boolean;
  taskSlug: TaskSlug = TaskSlug.MineInvite;

  constructor(private store: Store<IRootAppState>,
              private goalsService: GoalsService) {}

  private updateIsInviteMined() {
    if (this.isInviteMined) {
      return;
    }

    this.isInviteMined = this.transactions.some((tx: IDisplayTransaction) => tx.action === TransactionAction.INVITE && tx.isCoinbase);

    if (this.goalsService.getTaskStatus(this.taskSlug) !== ProgressStatus.Complete) {
      this.store.dispatch(new SetTaskStatus(this.taskSlug, ProgressStatus.Complete));
    }
  }
}
