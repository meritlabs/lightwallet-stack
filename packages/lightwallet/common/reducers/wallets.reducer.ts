import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { DisplayWallet, IDisplayWalletOptions } from '@merit/common/models/display-wallet';
import { formatAmount } from '@merit/common/utils/format';

export interface IWalletsState {
  wallets: DisplayWallet[];
  walletsMap: { [walletId: string]: DisplayWallet; };
  loading: boolean;
  totals: IWalletTotals;
  totalsLoading: boolean;
}

export interface IWalletTotals {
  totalNetworkValue: string;
  totalMiningRewards: string;
  totalAmbassadorRewards: string;
  totalWalletsBalance: string;
  totalWalletsBalanceFiat: string;
  allBalancesHidden: boolean;
  totalCommunitySize: number;
}

const DEFAULT_STATE: IWalletsState = {
  wallets: [],
  walletsMap: {},
  totals: {
    totalNetworkValue: '0.00',
    totalMiningRewards: '0.00',
    totalAmbassadorRewards: '0.00',
    totalWalletsBalance: '0.00',
    totalWalletsBalanceFiat: '0.00',
    allBalancesHidden: false,
    totalCommunitySize: 0
  },
  loading: true,
  totalsLoading: true
};

export enum WalletsActionType {
  Add = '[Wallets] Add',
  Update = '[Wallets] Update',
  UpdateOne = '[Wallets] Update one',
  Refresh = '[Wallets] Refresh',
  RefreshOne = '[Wallets] Refresh one',
  RefreshTotals = '[Wallets] Refresh totals',
  UpdateTotals = '[UpdateTotals] Update totals'
}

export class AddWalletAction implements Action {
  type = WalletsActionType.Add;

  constructor(public wallet: DisplayWallet) {
  }
}

export class UpdateWalletsAction implements Action {
  type = WalletsActionType.Update;
  totals: any;
  walletsMap: any = {};

  constructor(public payload: DisplayWallet[]) {
    payload.forEach(w => this.walletsMap[w.id] = w);
  }
}

export class UpdateOneWalletAction implements Action {
  type = WalletsActionType.UpdateOne;
  constructor(public wallet: DisplayWallet) {}
}

export class RefreshWalletsAction implements Action {
  type = WalletsActionType.Refresh;
}

export class RefreshOneWalletAction implements Action {
  type = WalletsActionType.RefreshOne;
  constructor(public wallet: DisplayWallet, public opts: IDisplayWalletOptions = {}) {}
}

export class UpdateWalletTotalsAction implements Action {
  type = WalletsActionType.UpdateTotals;
  constructor(public totals: IWalletTotals) {}
}

export type WalletsAction = AddWalletAction & UpdateWalletsAction & RefreshWalletsAction & UpdateOneWalletAction & RefreshOneWalletAction & UpdateWalletTotalsAction;

export function walletsReducer(state: IWalletsState = DEFAULT_STATE, action: WalletsAction) {
  switch (action.type) {
    case WalletsActionType.Add:
      const newWallet: DisplayWallet = action.wallet;
      return {
        ...state,
        walletsMap: {
          ...state.walletsMap,
          [newWallet.id]: newWallet
        },
        wallets: [
          ...state.wallets,
          newWallet
        ],
        totalsLoading: true
      };

    case WalletsActionType.Refresh:
      return {
        ...state,
        loading: true
      };

    case WalletsActionType.Update:
      return {
        ...state,
        loading: false,
        wallets: action.payload,
        walletsMap: action.walletsMap
      };

    case WalletsActionType.UpdateOne:
      const index: number = state.wallets.findIndex((w: DisplayWallet) => w.id === action.wallet.id);
      state.wallets[index] = action.wallet;
      return {
        ...state,
        walletsMap: {
          ...state.walletsMap,
          [action.wallet.id]: action.wallet
        }
      };

    case WalletsActionType.RefreshTotals:
      return {
        ...state,
        totalsLoading: true
      };

    case WalletsActionType.UpdateTotals:
      return {
        ...state,
        totalsLoading: false,
        totals: action.totals
      };

    default:
      return state;
  }
}

export const selectWalletsState = createFeatureSelector<IWalletsState>('wallets');
export const selectWalletsLoading = createSelector(selectWalletsState, state => state.loading);
export const selectWallets = createSelector(selectWalletsState, state => state.wallets);
export const selectConfirmedWallets = createSelector(selectWallets, wallets => wallets.filter((w: DisplayWallet) => w.client.confirmed));
export const selectWalletTotals = createSelector(selectWalletsState, state => state.totals);
export const selectWalletTotalsLoading = createSelector(selectWalletsState, state => state.totalsLoading);
export const selectWalletById = (id: string) => createSelector(selectWalletsState, state => state.walletsMap[id]);
