import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IFullGoal, IGoal, ITask } from '@merit/common/models/achievement';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { GoalsService } from '@merit/common/services/goals.service';
import { GoalSlug, TaskSlug, TaskStatus } from '@merit/common/models/goals';
import { SetTaskStatus } from '@merit/common/reducers/goals.reducer';


@Component({
  selector: 'app-task-confirm',
  templateUrl: './task-confirm.component.html',
  styleUrls: ['./task-confirm.component.sass'],
})
export class TaskConfirmComponent implements OnInit, OnChanges {
  constructor(private store: Store<IRootAppState>,
              private goalsService: GoalsService) {}

  @Input() taskSlug: TaskSlug;
  @Input() goalSlug: GoalSlug;
  @Input() isDone: boolean;
  @Input() arrow: string;
  trackerSettings: boolean;

  goal: IFullGoal;
  task: ITask;

  ngOnInit() {
    this.goal = this.goalsService.getGoal(this.goalSlug);
    this.task = this.goalsService.getTask(this.taskSlug);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isDone && this.taskSlug in TaskSlug) {
      this.finishTask();
    }
  }

  finishTask() {
    if (this.taskSlug) {
      this.store.dispatch(new SetTaskStatus(this.taskSlug, TaskStatus.Complete));
    }
  }
}
