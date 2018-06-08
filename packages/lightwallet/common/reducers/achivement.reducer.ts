import { Achievement, Achievements } from '@merit/common/models/achievement';
import { Action } from '@ngrx/store';

const DEFAULT_STATE = {
  achievements: [],
  token: '',
  settings: {
    id: '',
    userId: '',
    isSetupTrackerEnabled: true,
    isWelcomeDialogEnabled: true,
  },
};

export interface IAchivementsState {
  achievements: Achievement[];
  token: string;
  settings: {
    isSetupTrackerEnabled: boolean;
    isWelcomeDialogEnabled: boolean;
  };
}

export function AchivementsReducer(state: IAchivementsState = DEFAULT_STATE, action: AchivementsAction) {
  switch (action.type) {
    case AchivementsAction.LoadAchivements:
      return {
        ...state,
        achievements: [...action.achievements],
      };
    case AchivementsAction.SetAuthorizeTokenAction:
      return {
        ...state,
        token: action.token,
      };
    case AchivementsAction.SetAchivementsSettingsAction:
      return {
        ...state,
        settings: action.settings,
      };
    case AchivementsAction.CompleteAchivementAction:
      let task: any = state.achievements.filter((item: any) => item.id === action.completeTask.id)[0],
        index = state.achievements.indexOf(task);
      if (task.conditions.length === 1) task.status = 1;
      state.achievements[index] = task;
      return {
        ...state,
        achievements: state.achievements,
      };
    default:
      return state;
  }
}

export namespace AchivementsAction {
  export const LoadAchivements = 'LoadAchivements',
    SetAuthorizeTokenAction = 'SetAuthorizeTokenAction',
    SetAchivementsSettingsAction = 'SetAchivementsSettingsAction',
    CompleteAchivementAction = 'CompleteAchivementAction';
}

export interface SetAuthorizeTokenAction extends Action {
  token: string;
}

export class SetAuthorizeTokenAction implements Action {
  readonly type = AchivementsAction.SetAuthorizeTokenAction;

  constructor(public token: string) {}
}

export interface SetAchivementsSettingsAction extends Action {
  settings: {};
}

export class SetAchivementsSettingsAction implements Action {
  readonly type = AchivementsAction.SetAchivementsSettingsAction;

  constructor(public settings: {}) {}
}

export interface CompleteAchivementAction extends Action {
  completeTask: any;
}

export class CompleteAchivementAction implements Action {
  readonly type = AchivementsAction.CompleteAchivementAction;

  constructor(public completeTask: any) {}
}

export interface SetAchivementsAction extends Action {
  achievements: Achievement[];
}

export class SetAchivementsAction implements Action {
  readonly type = AchivementsAction.LoadAchivements;

  constructor(public achievements: Achievement[]) {}
}

export type AchivementsAction = SetAchivementsAction &
  SetAuthorizeTokenAction &
  SetAchivementsSettingsAction &
  CompleteAchivementAction;
