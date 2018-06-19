import { IFullProgress, IGoalSettings, TaskSlug, ProgressStatus } from '@merit/common/models/goals';
import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

export interface IGoalsState {
  loading: boolean;
  progress: IFullProgress;
  settings: IGoalSettings;
}

const DEFAULT_STATE: IGoalsState = {
  loading: true,
  progress: null,
  settings: null
};

export enum GoalsActionType {
  SetLoading = '[Goals] Set loading',
  RefreshProgress = '[Goals] Refresh progress',
  UpdateProgress = '[Goals] Update progress',
  RefreshSettings = '[Goals] Refresh settings',
  UpdateSettings = '[Goals] Update settings',
  SetTaskStatus = '[Goals] Set task status',
  SaveSettings = '[Goals] Save settings',
}

export class SetGoalsLoadingAction implements Action {
  type = GoalsActionType.SetLoading;

  constructor(public loading: boolean) {}
}

export class RefreshGoalsProgressAction implements Action {
  type = GoalsActionType.RefreshProgress;
}

export class UpdateGoalsProgressAction implements Action {
  type = GoalsActionType.UpdateProgress;

  constructor(public progress: IFullProgress) {}
}

export class RefreshGoalSettingsAction implements Action {
  type = GoalsActionType.RefreshSettings;
}

export class UpdateGoalSettingsAction implements Action {
  type = GoalsActionType.UpdateSettings;

  constructor(public settings: IGoalSettings) {}
}

export class SaveGoalSettingsAction implements Action {
  type = GoalsActionType.SaveSettings;

  constructor(public settings: IGoalSettings) {}
}

export class SetTaskStatus implements Action {
  type = GoalsActionType.SetTaskStatus;

  constructor(public taskSlug: TaskSlug, public status: ProgressStatus) {}
}

export type GoalAction =
  SetGoalsLoadingAction
  & RefreshGoalsProgressAction
  & UpdateGoalsProgressAction
  & RefreshGoalSettingsAction
  & UpdateGoalSettingsAction
  & SetTaskStatus
  & SaveGoalSettingsAction;

export function goalsReducer(state: IGoalsState = DEFAULT_STATE, action: GoalAction) {
  switch (action.type) {
    case GoalsActionType.SetLoading:
      return {
        ...state,
        loading: action.loading
      };

    case GoalsActionType.RefreshProgress:
    case GoalsActionType.SetTaskStatus:
      return {
        ...state,
        loading: true
      };

    case GoalsActionType.UpdateProgress:
      return {
        ...state,
        loading: false,
        progress: action.progress
      };

    case GoalsActionType.UpdateSettings:
      return {
        ...state,
        settings: action.settings
      };

    default:
      return state;
  }
}

export const selectGoalsState = createFeatureSelector<IGoalsState>('goals');
export const selectGoalsLoading = createSelector(selectGoalsState, state => state.loading);
export const selectGoalsProgress = createSelector(selectGoalsState, state => state.progress);
export const selectGoalSettings = createSelector(selectGoalsState, state => state.settings);
