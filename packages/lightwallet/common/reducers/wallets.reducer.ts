import { Action } from '@ngrx/store';
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
      state.wallets.push((action as AddWalletAction).payload);
      break;

    case WalletsActionType.Refresh:
      state.loading = true;
      break;

    case WalletsActionType.Update:
      state.loading = false;
      state.wallets = (action as UpdateWalletsAction).payload;
      break;
  }

  return state;
}

