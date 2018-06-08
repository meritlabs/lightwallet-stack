import { Component, OnInit, Input } from '@angular/core';
import { Achievement } from '@merit/common/models/achievement';
import { AchievementsService } from '@merit/common/services/achievements.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-preview',
  templateUrl: './task-preview.component.html',
  styleUrls: ['./task-preview.component.sass'],
})
export class TaskPreviewComponent implements OnInit {
  constructor(private AchievementsService: AchievementsService, private router: Router) {}

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
        console.log(val);

        return;
      default:
        return this.router.navigate(['/wallets']);
    }
  }
}
