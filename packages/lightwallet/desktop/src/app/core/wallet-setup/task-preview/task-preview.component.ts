import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SetShareDialogAction } from '@merit/common/reducers/interface-preferences.reducer';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { GoalsService } from '@merit/common/services/goals.service';
import { TaskSlug, ProgressStatus, IFullGoal, GoalSlug } from '@merit/common/models/goals';

@Component({
  selector: 'task-preview',
  templateUrl: './task-preview.component.html',
  styleUrls: ['./task-preview.component.sass'],
})
export class TaskPreviewComponent implements OnInit {
  constructor(private router: Router, private store: Store<IRootAppState>, private goalService: GoalsService) {}

  @Input()
  goal: IFullGoal;
  @Input()
  isComplete: boolean;
  @Input()
  isConfirmed: boolean;

  route: string;
  readinessBackground: string;

  get showLockOverlay() {
    return !this.isConfirmed && this.goal.slug !== 'creator' && this.goal.status !== 2;
  }

  async ngOnInit() {
    const toDo = this.goal.tasks.filter((item: any) => item.status === ProgressStatus.Incomplete),
      complete = this.goal.tasks.length - toDo.length,
      total = this.goal.tasks.length,
      readiness = (complete / total) * 100;

    this.readinessBackground = `linear-gradient(to right, #74cd4f ${readiness}%, #555b7033 ${readiness}%)`;
  }

  action(slug: TaskSlug) {
    switch (slug) {
      case TaskSlug.InviteFriends:
        this.store.dispatch(new SetShareDialogAction(true));
        return this.router.navigate(['/wallets']);
      case TaskSlug.ReceiveInviteRequest:
        return this.router.navigate([`/invites/requests`]);
      case TaskSlug.ConfirmInviteRequest:
        return this.router.navigate([`/invites/requests`]);
      case TaskSlug.MineInvite:
        return this.router.navigate([`/history`]);
      case TaskSlug.UnlockWallet:
        return this.router.navigate([`/history`]);
      default:
        return this.router.navigate(['/wallets']);
    }
  }
}
