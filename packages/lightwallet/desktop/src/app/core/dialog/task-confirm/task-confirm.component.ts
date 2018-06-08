import { Component, OnInit, Input } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { Achievements, Achievement } from '@merit/common/models/achievement';
import { AchievementsService } from '@merit/common/services/achievements.service';

@Component({
  selector: 'app-task-confirm',
  templateUrl: './task-confirm.component.html',
  styleUrls: ['./task-confirm.component.sass'],
})
export class TaskConfirmComponent implements OnInit {
  constructor(private store: Store<IRootAppState>, private AchievementsService: AchievementsService) {}

  @Input() goalName: string;
  trackerSettings: boolean = false;
  task: any;

  async ngOnInit() {
    await this.store.select('achievements').subscribe(res => {
      this.trackerSettings = res.settings.isSetupTrackerEnabled;
      this.task = res.achievements.filter((item: any) => item.name === this.goalName)[0];
      console.log(this.task);
    });
  }

  finishTask() {
    this.AchievementsService.updateGoal(this.task.id, 0);
  }
}
