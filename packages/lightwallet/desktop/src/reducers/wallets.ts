import { Action } from '@ngrx/store';
import { IDisplayWallet } from '../../../mobile/src/models/display-wallet';

export interface WalletsState {
  wallets: IDisplayWallet[];
}

export enum WalletsActionType {
  DELETE = 'delete',
  UPDATE = 'update',
  REFRESH = 'refresh',
  REFRESHED = 'refreshed'
}

export interface WalletsAction extends Action {
  type: WalletsActionType;
  wallets: IDisplayWallet[];
}

const DEFAULT_STATE: WalletsState = {
  wallets: []
};

export function walletsReducer(state: WalletsState = DEFAULT_STATE, action: WalletsAction) {
  switch (action.type) {
    case WalletsActionType.UPDATE:
      state.wallets = action.wallets;
      break;
  }

  return state;
}
