import { Component, OnInit, Input } from '@angular/core';
import { Achievement } from '@merit/common/models/achievement';
import { AchievementsService } from '@merit/common/services/achievements.service';

@Component({
  selector: 'app-task-preview',
  templateUrl: './task-preview.component.html',
  styleUrls: ['./task-preview.component.sass'],
})
export class TaskPreviewComponent implements OnInit {
  constructor(private AchievementsService: AchievementsService) {}

  @Input() goal;
  @Input() wallet;
  @Input() isComplete;

  async ngOnInit() {
    this._completeWalletConfirmationGoal();
  }

  _completeWalletConfirmationGoal() {
    let isConfirmed: boolean = this.wallet.confirmed,
      goal: Achievement = this.goal;
    if (isConfirmed && goal.name === 'Create Wallet' && goal.status !== 1) {
      console.log(goal);
      this.AchievementsService.updateGoal(goal.id, 0);
    }
  }
}
