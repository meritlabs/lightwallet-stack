import { Achievement, Achievements } from '@merit/common/models/achievement';
import { Action } from '@ngrx/store';

const DEFAULT_STATE = {
  achievements: [],
  token: '',
  settings: {},
};

export interface IAchivementsState {
  achievements: Achievement[];
  token: string;
  settings: Object;
}

export function AchivementsReducer(state: IAchivementsState = DEFAULT_STATE, action: AchivementsAction) {
  switch (action.type) {
    case AchivementsAction.LoadAchivements:
      return {
        ...state,
        achievements: [...action.payload],
      };
    case AchivementsAction.GetAuthorizeToken:
      return {
        ...state,
        token: [...action.payload],
      };
    default:
      return state;
  }
}

export namespace AchivementsAction {
  export const LoadAchivements = 'LoadAchivements',
    GetAuthorizeToken = 'GetAuthorizeToken';
}

export interface GetAuthorizeToken extends Action {
  payload: Achievement[];
}

export class GetAuthorizeToken implements Action {
  readonly type = AchivementsAction.GetAuthorizeToken;

  constructor(public payload: Achievement[]) {}
}

export interface LoadAchivementsAction extends Action {
  payload: Achievement[];
}

export class LoadAchivementsAction implements Action {
  readonly type = AchivementsAction.LoadAchivements;

  constructor(public payload: Achievement[]) {}
}

export type AchivementsAction = LoadAchivementsAction & GetAuthorizeToken;
