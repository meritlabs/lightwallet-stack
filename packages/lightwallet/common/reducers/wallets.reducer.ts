import { Action } from '@ngrx/store';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';

export interface WalletsState {
  wallets: DisplayWallet[];
}

export enum WalletsActionType {
  Add = 'add'
}

export interface WalletsAction extends Action {
  type: WalletsActionType;
  wallets: DisplayWallet[];
}

export class AddWalletAction implements Action {
  type = WalletsActionType.Add;

  constructor(public payload: MeritWalletClient) {
  }
}

const DEFAULT_STATE: WalletsState = {
  wallets: []
};

export function walletsReducer(state: WalletsState = DEFAULT_STATE, action: WalletsAction) {
  switch (action.type) {
    case WalletsActionType.Add:
      state.wallets = action.wallets;
      break;
  }

  return state;
}
