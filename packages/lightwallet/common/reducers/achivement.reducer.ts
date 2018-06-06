import { Achievement, Achievements } from '@merit/common/models/achievement';
import { Action } from '@ngrx/store';

const DEFAULT_STATE = {
  achievements: [],
};

export interface IAchivementsState {
  achievements: Achievement[];
}

export function AchivementsReducer(state: IAchivementsState = DEFAULT_STATE, action: AchivementsAction) {
  switch (action.type) {
    case AchivementsAction.LOAD_QUESTS:
      return {
        ...state,
        achievements: [...action.payload],
      };
    default:
      return state;
  }
}

export namespace AchivementsAction {
  export const LOAD_QUESTS = 'LOAD_QUESTS';
}

export interface LoadAchivementsAction extends Action {
  payload: Achievement[];
}

export class LoadAchivementsAction implements Action {
  readonly type = AchivementsAction.LOAD_QUESTS;

  constructor(public payload: Achievement[]) {}
}

export type AchivementsAction = LoadAchivementsAction;
