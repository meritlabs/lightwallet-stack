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

  @Input() goal: Achievement;
  @Input() wallet;

  async ngOnInit() {
    this._completeWalletConfirmationGoal();
  }

  _completeWalletConfirmationGoal() {
    let isConfirmed: boolean = this.wallet.confirmed;
    if (isConfirmed && this.goal.name === 'Create Wallet' && this.goal.status !== 1) {
      console.log(this.goal);
      this.AchievementsService.updateGoal(this.goal.id, 0);
    }
  }
}
