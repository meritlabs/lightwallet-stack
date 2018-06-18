import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SetShareDialogAction } from '@merit/common/reducers/interface-preferences.reducer';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { GoalsService } from '@merit/common/services/goals.service';
import { TaskSlug, TaskStatus } from '@merit/common/models/goals';
import { SetTaskStatus } from '@merit/common/reducers/goals.reducer';

@Component({
  selector: 'app-task-preview',
  templateUrl: './task-preview.component.html',
  styleUrls: ['./task-preview.component.sass'],
})
export class TaskPreviewComponent implements OnInit {
  constructor(
    private router: Router,
    private store: Store<IRootAppState>,
    private goalService: GoalsService
  ) {}

  @Input() goal;
  @Input() wallet;
  @Input() isComplete;

  route: string;
  readinessBackground: string;

  async ngOnInit() {
    this._completeWalletConfirmationGoal();
    let toDo = this.goal.conditions.filter((item: any) => item.status === 0),
      complete = this.goal.conditions.length - toDo.length,
      total = this.goal.conditions.length,
      readiness = complete / total * 100;
    this.readinessBackground = `linear-gradient(to right, #74cd4f ${readiness}%, #555b7033 ${readiness}%)`;
  }

  async _completeWalletConfirmationGoal() {
    let isConfirmed: boolean = this.wallet.confirmed,
      goal: any = this.goal;
    if (isConfirmed && goal.name === 'Creator' && goal.status !== 1 && goal.version !== 0) {
      this.store.dispatch(new SetTaskStatus(TaskSlug.CreateWallet, TaskStatus.Complete));
      this.store.dispatch(new SetTaskStatus(TaskSlug.UnlockWallet, TaskStatus.Complete));
    }
  }

  action(slug: TaskSlug) {
    switch (slug) {
      case TaskSlug.InviteFriends:
        this.store.dispatch(new SetShareDialogAction(true));
        return this.router.navigate(['/wallets']);
      case TaskSlug.ReceiveInviteRequest:
        return this.router.navigate([`/invites/requests`]);
      case TaskSlug.ConfirmInviteRequest:
        return this.router.navigate([`/invites/requests`]);
      case TaskSlug.MineInvite:
        return this.router.navigate([`/history`]);
      case TaskSlug.UnlockWallet:
        return this.router.navigate([`/history`]);
      default:
        return this.router.navigate(['/wallets']);
    }
  }
}
