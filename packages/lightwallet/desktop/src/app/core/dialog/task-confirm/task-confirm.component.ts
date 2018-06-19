import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { GoalsService } from '@merit/common/services/goals.service';
import { GoalSlug, TaskSlug, ProgressStatus, IFullGoal, ITask } from '@merit/common/models/goals';
import { SetTaskStatus } from '@merit/common/reducers/goals.reducer';

@Component({
  selector: 'task-confirm',
  templateUrl: './task-confirm.component.html',
  styleUrls: ['./task-confirm.component.sass'],
})
export class TaskConfirmComponent implements OnInit {
  constructor(private store: Store<IRootAppState>,
              private goalsService: GoalsService) {}

  @Input()
  taskSlug: TaskSlug;

  private _isDone: boolean;

  @Input()
  set isDone(val: boolean) {
    this._isDone = Boolean(val);

    if (this._isDone && this.taskSlug in TaskSlug) {
      this.finishTask();
    }
  }

  get isDone() {
    return this._isDone;
  }

  @Input()
  arrow: string;

  trackerSettings: boolean;

  goal: IFullGoal;
  task: ITask;

  ngOnInit() {
    this.goal = this.goalsService.getGoal(
      this.goalsService.getGoalForTask(this.taskSlug)
    );
    this.task = this.goalsService.getTask(this.taskSlug);
  }

  finishTask() {
    if (this.taskSlug in TaskSlug) {
      this.store.dispatch(new SetTaskStatus(this.taskSlug, ProgressStatus.Complete));
    }
  }
}
