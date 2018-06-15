import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { IAchievements, Achievement } from '@merit/common/models/achievement';
import { achievementsService } from '@merit/common/services/achievements.service';
import { AchievementTask } from '@merit/common/utils/achievements.const';

@Component({
  selector: 'app-task-confirm',
  templateUrl: './task-confirm.component.html',
  styleUrls: ['./task-confirm.component.sass'],
})
export class TaskConfirmComponent implements OnInit {
  constructor(private store: Store<IRootAppState>, private achievementsService: achievementsService) {}

  @Input() goalName: string;
  @Input() achvName: string;
  @Input() isDone: boolean;
  @Input() arrow: string;
  trackerSettings: boolean = false;
  achv: any;
  task: any;

  async ngOnInit() {
    await this.store.select('achievements').subscribe(res => {
      this.trackerSettings = res.settings.isSetupTrackerEnabled;
      this.achv = res.achievements.filter((item: any) => item.name === this.achvName)[0];
      if (this.achv) this.task = this.achv.conditions.filter((item: any) => item.name === this.goalName)[0];
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (
      this.isDone &&
      (this.goalName === AchievementTask.InviteFriends ||
        this.goalName === AchievementTask.ConfirmInviteRequest ||
        this.goalName === AchievementTask.GetInviteRequest ||
        this.goalName === AchievementTask.MineInvite)
    ) {
      this.finishTask();
    }
  }

  finishTask() {
    if (this.achv) {
      this.achievementsService.updateGoal(this.achv.id, this.task.slug);
    }
  }
}
