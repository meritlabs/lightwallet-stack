import { Component, Input, OnInit } from '@angular/core';
import { IFullGoal, IFullTask, ProgressStatus, TaskSlug } from '@merit/common/models/goals';
import { IRootAppState } from '@merit/common/reducers';
import { selectGoalSettings, SetTaskStatus } from '@merit/common/reducers/goals.reducer';
import { GoalsService } from '@merit/common/services/goals.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'task-confirm',
  templateUrl: './task-confirm.component.html',
  styleUrls: ['./task-confirm.component.sass'],
})
export class TaskConfirmComponent implements OnInit {
  @Input()
  taskSlug: TaskSlug;

  private _isDone: boolean;

  @Input()
  set isDone(val: boolean) {
    this._isDone = Boolean(val);

    if (this._isDone) {
      this.finishTask();
    }
  }

  get isDone() {
    return this._isDone;
  }

  @Input()
  arrow: string;

  trackerEnabled$: Observable<boolean> = this.store.select(selectGoalSettings).pipe(
    filter(settings => !!settings),
    map(settings => settings.isSetupTrackerEnabled),
  );

  goal: IFullGoal;
  task: IFullTask;

  constructor(private store: Store<IRootAppState>, private goalsService: GoalsService) {}

  ngOnInit() {
    this.goal = this.goalsService.getGoal(this.goalsService.getGoalForTask(this.taskSlug));

    this.task = this.goalsService.getFullTask(this.taskSlug);
  }

  finishTask() {
    if (this.goalsService.getTaskStatus(this.taskSlug) !== ProgressStatus.Complete) {
      this.store.dispatch(new SetTaskStatus(this.taskSlug, ProgressStatus.Complete));
    }
  }
}
