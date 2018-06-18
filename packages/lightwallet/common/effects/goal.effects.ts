import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  GoalAction, GoalsActionType,
  RefreshGoalsProgressAction, SetTaskStatus, UpdateGoalSettingsAction,
  UpdateGoalsProgressAction
} from '@merit/common/reducers/goals.reducer';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { GoalsService } from '@merit/common/services/goals.service';
import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';
import { IFullProgress, IGoalSettings } from '@merit/common/models/goals';

@Injectable()
export class GoalEffects {

  @Effect()
  refreshProgress$: Observable<UpdateGoalsProgressAction> = this.actions$
    .pipe(
      ofType(GoalsActionType.RefreshProgress),
      switchMap(() => fromPromise(this.goalsService.getProgress())),
      map((progress: IFullProgress) =>
        new UpdateGoalsProgressAction(progress)
      )
    );

  @Effect()
  refreshSettings$: Observable<UpdateGoalSettingsAction> = this.actions$
    .pipe(
      ofType(GoalsActionType.RefreshSettings),
      switchMap(() => fromPromise(this.goalsService.getSettings())),
      map((settings: IGoalSettings) => new UpdateGoalSettingsAction(settings))
    );

  @Effect()
  setTaskStatus$: Observable<RefreshGoalsProgressAction> = this.actions$
    .pipe(
      ofType(GoalsActionType.SetTaskStatus),
      switchMap((action: SetTaskStatus) => fromPromise(this.goalsService.setTaskStatus(action.taskSlug, action.status))),
      map(() => new RefreshGoalsProgressAction())
    );

  @Effect()
  init$: Observable<RefreshGoalsProgressAction> = fromPromise(this.goalsService.initService())
    .pipe(
      switchMap(() => fromPromise(this.goalsService.getProgress())),
      map(() =>
        new RefreshGoalsProgressAction()
      )
    );

  constructor(private actions$: Actions,
              private goalsService: GoalsService) {}
}
