import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
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
    switch (this.goalName) {
      case 'Invite Your Friends to Merit!':
        if (this.isDone) {
          this.finishTask();
        }
        return;
      case 'Enable Email Notifications':
        if (this.isDone) {
          this.finishTask();
        }
        return;
      default:
        return;
    }
  }

  finishTask() {
    if (this.achv) {
      this.AchievementsService.updateGoal(this.achv.id, this.task.slug);
    }
  }
}
