import { Component, OnInit, Input } from '@angular/core';
import { Achievement } from '@merit/common/models/achievement';
import { AchievementsService } from '@merit/common/services/achievements.service';
import { Router } from '@angular/router';
import { SetShareDialogAction } from '@merit/common/reducers/interface-preferences.reducer';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';

@Component({
  selector: 'app-task-preview',
  templateUrl: './task-preview.component.html',
  styleUrls: ['./task-preview.component.sass'],
})
export class TaskPreviewComponent implements OnInit {
  constructor(
    private AchievementsService: AchievementsService,
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
      await this.AchievementsService.updateGoal(goal.id, 1);
      await this.AchievementsService.updateGoal(goal.id, 2);
    }
  }

  action(val) {
    switch (val) {
      case 'Invite Your Friends to Merit!':
        this.store.dispatch(new SetShareDialogAction(true));
        return this.router.navigate(['/wallets']);
      case 'Add a friend to your invite waitlist':
        return this.router.navigate([`/invites/requests`]);
      case 'Confirm an invite request':
        return this.router.navigate([`/invites/requests`]);
      case 'Mine an invite':
        return this.router.navigate([`/history`]);
      case 'Unlock wallet':
        return this.router.navigate([`/history`]);
      default:
        return this.router.navigate(['/wallets']);
    }
  }
}
