import { Component, OnInit, Input } from '@angular/core';
import { Achievement } from '@merit/common/models/achievement';
import { achievementsService } from '@merit/common/services/achievements.service';
import { Router } from '@angular/router';
import { SetShareDialogAction } from '@merit/common/reducers/interface-preferences.reducer';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { AchievementTask } from '@merit/common/utils/achievements.const';

@Component({
  selector: 'app-task-preview',
  templateUrl: './task-preview.component.html',
  styleUrls: ['./task-preview.component.sass'],
})
export class TaskPreviewComponent implements OnInit {
  constructor(
    private achievementsService: achievementsService,
    private router: Router,
    private store: Store<IRootAppState>
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
      await this.achievementsService.updateGoal(goal.id, 1);
      await this.achievementsService.updateGoal(goal.id, 2);
    }
  }

  action(val) {
    switch (val) {
      case AchievementTask.InviteFriends:
        this.store.dispatch(new SetShareDialogAction(true));
        return this.router.navigate(['/wallets']);
      case AchievementTask.GetInviteRequest:
        return this.router.navigate([`/invites/requests`]);
      case AchievementTask.ConfirmInviteRequest:
        return this.router.navigate([`/invites/requests`]);
      case AchievementTask.MineInvite:
        return this.router.navigate([`/history`]);
      case AchievementTask.UnlockWallet:
        return this.router.navigate([`/history`]);
      default:
        return this.router.navigate(['/wallets']);
    }
  }
}
