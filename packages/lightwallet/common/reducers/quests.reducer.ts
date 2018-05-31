import { Quest, Quests } from '@merit/common/models/quest';
import { Action } from '@ngrx/store';

const DEFAULT_STATE = {
  quests: [],
};

export interface IQuestsState {
  quests: Quest[];
}

export function QuestsReducer(state: IQuestsState = DEFAULT_STATE, action: QuestsAction) {
  switch (action.type) {
    case QuestsAction.LOAD_QUESTS:
      return {
        ...state,
        quests: [...action.payload],
      };
    default:
      return state;
  }
}

export namespace QuestsAction {
  export const LOAD_QUESTS = 'LOAD_QUESTS';
}

export interface LoadQuestsAction extends Action {
  payload: Quest[];
}

export class LoadQuestsAction implements Action {
  readonly type = QuestsAction.LOAD_QUESTS;

  constructor(public payload: Quest[]) {}
}

export type QuestsAction = LoadQuestsAction;
