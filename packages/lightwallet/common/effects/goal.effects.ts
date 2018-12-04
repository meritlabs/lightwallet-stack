import { Injectable } from '@angular/core';
import { IFullProgress, IGoalSettings } from '@merit/common/models/goals';
import {
  GoalsActionType,
  RefreshGoalsProgressAction,
  SaveGoalSettingsAction,
  SetTaskStatus,
  UpdateGoalSettingsAction,
  UpdateGoalsProgressAction,
} from '@merit/common/reducers/goals.reducer';
import { GoalsService } from '@merit/common/services/goals.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class GoalEffects {
  @Effect()
  refreshProgress$: Observable<UpdateGoalsProgressAction> = this.actions$.pipe(
    ofType(GoalsActionType.RefreshProgress),
    debounceTime(500),
    switchMap(() => fromPromise(this.goalsService.getProgress())),
    map((progress: IFullProgress) => new UpdateGoalsProgressAction(progress, this.goalsService.statusByTask)),
  );

  @Effect()
  refreshSettings$: Observable<UpdateGoalSettingsAction> = this.actions$.pipe(
    ofType(GoalsActionType.RefreshSettings),
    debounceTime(500),
    switchMap(() => fromPromise(this.goalsService.getSettings())),
    map((settings: IGoalSettings) => new UpdateGoalSettingsAction(settings)),
  );

  @Effect()
  saveSettings$: Observable<UpdateGoalSettingsAction> = this.actions$.pipe(
    ofType(GoalsActionType.SaveSettings),
    switchMap((action: SaveGoalSettingsAction) => fromPromise(this.goalsService.setSettings(action.settings))),
    map((settings: IGoalSettings) => new UpdateGoalSettingsAction(settings)),
  );

  @Effect()
  setTaskStatus$: Observable<RefreshGoalsProgressAction> = this.actions$.pipe(
    ofType(GoalsActionType.SetTaskStatus),
    switchMap((action: SetTaskStatus) => fromPromise(this.goalsService.setTaskStatus(action.taskSlug, action.status))),
    map(() => new RefreshGoalsProgressAction()),
  );

  constructor(private actions$: Actions, private goalsService: GoalsService) {}
}
