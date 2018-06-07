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
    default:
      return state;
  }
}

export namespace AchivementsAction {
  export const LoadAchivements = 'LoadAchivements',
    SetAuthorizeTokenAction = 'SetAuthorizeTokenAction',
    SetAchivementsSettingsAction = 'SetAchivementsSettingsAction';
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

export interface SetAchivementsAction extends Action {
  achievements: Achievement[];
}

export class SetAchivementsAction implements Action {
  readonly type = AchivementsAction.LoadAchivements;

  constructor(public achievements: Achievement[]) {}
}

export type AchivementsAction = SetAchivementsAction & SetAuthorizeTokenAction & SetAchivementsSettingsAction;
