import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { DisplayWallet } from '@merit/common/models/display-wallet';

export interface WalletsState {
  wallets: DisplayWallet[];
  loading: boolean;
}

export enum WalletsActionType {
  Add = '[Wallets] Add',
  Update = '[Wallets] Update',
  Refresh = '[Wallets] Refresh'
}

export class AddWalletAction implements Action {
  type = WalletsActionType.Add;

  constructor(public payload: DisplayWallet) {}
}

export class UpdateWalletsAction implements Action {
  type = WalletsActionType.Update;
  constructor(public payload: DisplayWallet[]) {}
}

export class RefreshWalletsAction implements Action {
  type = WalletsActionType.Refresh;
}

export type WalletsAction = AddWalletAction | UpdateWalletsAction | RefreshWalletsAction;

const DEFAULT_STATE: WalletsState = {
  wallets: [],
  loading: false
};

export function walletsReducer(state: WalletsState = DEFAULT_STATE, action: WalletsAction) {
  switch (action.type) {
    case WalletsActionType.Add:
      return {
        ...state,
        wallets: [
          ...state.wallets,
          (action as AddWalletAction).payload
        ]
      };

    case WalletsActionType.Refresh:
      return {
        ...state,
        loading: true
      };

    case WalletsActionType.Update:
      return {
        wallets: (action as UpdateWalletsAction).payload,
        loading: false
      };

    default: return state;
  }
}

export const selectWalletsState = createFeatureSelector<WalletsState>('wallets');
export const getWalletsLoading = createSelector(selectWalletsState, state => state.loading);
export const getWallets = createSelector(selectWalletsState, state => state.wallets);
