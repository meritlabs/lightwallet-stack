import { Achievement, Achievements } from '@merit/common/models/achievement';
import { Action } from '@ngrx/store';

const DEFAULT_STATE = {
  achievements: [],
  token: '',
  settings: {
    id: '',
    userId: '',
    isSetupTrackerEnabled: true,
  },
};

export interface IAchivementsState {
  achievements: Achievement[];
  token: string;
  settings: Object;
}

export function AchivementsReducer(state: IAchivementsState = DEFAULT_STATE, action: AchivementsAction) {
  switch (action.type) {
    case AchivementsAction.LoadAchivements:
      console.log(action);

      return {
        ...state,
        achievements: [...action.achievements],
      };
    case AchivementsAction.GetAuthorizeTokenAction:
      console.log(action);
      return {
        ...state,
        token: action.token,
      };
    case AchivementsAction.GetAchivementsSettingsAction:
      console.log(action);
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
    GetAuthorizeTokenAction = 'GetAuthorizeTokenAction',
    GetAchivementsSettingsAction = 'GetAchivementsSettingsAction';
}

export interface GetAuthorizeTokenAction extends Action {
  token: string;
}

export class GetAuthorizeTokenAction implements Action {
  readonly type = AchivementsAction.GetAuthorizeTokenAction;

  constructor(public token: string) {}
}

export interface GetAchivementsSettingsAction extends Action {
  settings: {};
}

export class GetAchivementsSettingsAction implements Action {
  readonly type = AchivementsAction.GetAchivementsSettingsAction;

  constructor(public settings: {}) {}
}

export interface LoadAchivementsAction extends Action {
  achievements: Achievement[];
}

export class LoadAchivementsAction implements Action {
  readonly type = AchivementsAction.LoadAchivements;

  constructor(public achievements: Achievement[]) {}
}

export type AchivementsAction = LoadAchivementsAction & GetAuthorizeTokenAction & GetAchivementsSettingsAction;
