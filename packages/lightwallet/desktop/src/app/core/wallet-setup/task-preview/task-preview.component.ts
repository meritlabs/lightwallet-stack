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

  async ngOnInit() {
    this._completeWalletConfirmationGoal();
  }

  _completeWalletConfirmationGoal() {
    let isConfirmed: boolean = this.wallet.confirmed,
      goal: any = this.goal;
    if (isConfirmed && goal.name === 'Create Wallet' && goal.status !== 1) {
      console.log(goal);
      this.AchievementsService.updateGoal(goal.id, 0);
    }
  }

  action(val) {
    console.log(val);

    switch (val) {
      case 'Share your invite code':
        this.store.dispatch(new SetShareDialogAction(true));
        return this.router.navigate(['/wallets']);
      case 'Name Your Wallet':
        return this.router.navigate([`/wallets/${this.wallet.id}/settings`]);
      case 'Hide your wallet balance':
        return this.router.navigate([`/wallets/${this.wallet.id}/settings`]);
      default:
        return this.router.navigate(['/wallets']);
    }
  }
}
