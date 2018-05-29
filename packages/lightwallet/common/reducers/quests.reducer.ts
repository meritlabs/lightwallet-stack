import { Quest, Quests } from '@merit/common/models/quest';
import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

export interface IQuestsState {
  quests: Quests[];
}

const DEFAULT_STATE: IQuestsState = {
  quests: [],
};

export enum QuestsActionType {
  Update = '[Quets] Update',
}

export class UpdateQuestsAction implements Action {
  type = QuestsActionType.Update;
}

export type QuestsAction = UpdateQuestsAction;

export function QuestsReducer(state: IQuestsState, action: QuestsAction) {}

export const selectQuestsState = createFeatureSelector<IQuestsState>('quests');
export const selectQuests = createSelector(selectQuestsState, state => state.quests);
