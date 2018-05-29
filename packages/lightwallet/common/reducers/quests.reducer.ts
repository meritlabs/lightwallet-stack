import { Quest, Quests } from '@merit/common/models/quest';
import { Action } from '@ngrx/store';

const DEFAULT_STATE = {
  quests: [
    new Quest('1', '1', '1', '1', [{ name: '1' }], 1),
    new Quest('2', '2', '2', '2', [{ name: '2' }], 2),
    new Quest('3', '3', '3', '3', [{ name: '3' }], 3),
  ],
};

export interface IQuestsState {
  quests: Quest[];
}

export function QuestsReducer(state: IQuestsState = DEFAULT_STATE, action: Action) {
  switch (action.type) {
    case QUEST_ACTION.LOAD_QUESTS:
      return {
        ...state,
        quests: [...state.quests],
      };
    default:
      return state;
  }
}

export namespace QUEST_ACTION {
  export const LOAD_QUESTS = 'LOAD_QUESTS';
}

export class LoadQuest implements Action {
  readonly type = QUEST_ACTION.LOAD_QUESTS;

  constructor(public payload: Quest) {}
}
