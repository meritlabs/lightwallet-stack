import { IWalletsState } from '@merit/common/reducers/wallets.reducer';
import { Action, createFeatureSelector } from '@ngrx/store';

export interface IAppState {
  loading: boolean;
  authorized: boolean;
}

const INITIAL_STATE: IAppState = {
  loading: true,
  authorized: false,
};

export enum AppReducerActionType {
  UPDATE = '[App] Update',
}

export class UpdateAppAction implements Action {
  type = AppReducerActionType.UPDATE;
  constructor(public payload: Partial<IAppState>) {}
}

export type AppReducerAction = UpdateAppAction;

export function appReducer(state: IAppState = INITIAL_STATE, action: AppReducerAction) {
  switch (action.type) {
    case AppReducerActionType.UPDATE:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

export const selectAppState = createFeatureSelector<IAppState>('app');
