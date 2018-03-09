import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { formatAmount } from '@merit/common/utils/format';

export interface WalletsState {
  wallets: DisplayWallet[];
  loading: boolean;
  totals: any;
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
  totals: any;
  constructor(public payload: DisplayWallet[]) {
    let totalMicros: any = {
      totalNetworkValue: 0,
      totalMiningRewards: 0,
      totalAmbassadorRewards: 0,
      totalWalletsBalance: 0
    }
    payload.forEach(w => {
      totalMicros.totalNetworkValue += w.totalNetworkValueMicro;
      totalMicros.totalMiningRewards += w.miningRewardsMicro;
      totalMicros.totalAmbassadorRewards += w.ambassadorRewardsMicro;
    });
    this.totals = {
      totalNetworkValue: formatAmount(totalMicros.totalNetworkValue,'mrt', {}),
      totalMiningRewards: formatAmount(totalMicros.totalMiningRewards,'mrt', {}),
      totalAmbassadorRewards: formatAmount(totalMicros.totalAmbassadorRewards,'mrt', {})
    }
  }
}

export class RefreshWalletsAction implements Action {
  type = WalletsActionType.Refresh;
}

export type WalletsAction = AddWalletAction | UpdateWalletsAction | RefreshWalletsAction;

const DEFAULT_STATE: WalletsState = {
  wallets: [],
  loading: false,
  totals: {
    totalNetworkValue: 0,
    totalMiningRewards: 0,
    totalAmbassadorRewards: 0
  }
};

export function walletsReducer(state: WalletsState = DEFAULT_STATE, action: WalletsAction) {
  switch (action.type) {
    case WalletsActionType.Add:
      const newWallet: DisplayWallet = (action as AddWalletAction).payload;
      return {
        ...state,
        wallets: [
          ...state.wallets,
          newWallet
        ],
        totals: {
          totalNetworkValue: state.totals.totalNetworkValue + newWallet.totalNetworkValueMicro,
          totalMiningRewards: state.totals.totalMiningRewards + newWallet.miningRewardsMicro,
          totalAmbassadorRewards: state.totals.totalAmbassadorRewards + newWallet.ambassadorRewardsMicro,
        }
      };

    case WalletsActionType.Refresh:
      return {
        ...state,
        loading: true
      };

    case WalletsActionType.Update:
      return {
        wallets: (action as UpdateWalletsAction).payload,
        loading: false,
        totals: (action as UpdateWalletsAction).totals
      };

    default: return state;
  }
}

export const selectWalletsState = createFeatureSelector<WalletsState>('wallets');
export const getWalletsLoading = createSelector(selectWalletsState, state => state.loading);
export const getWallets = createSelector(selectWalletsState, state => state.wallets);
export const getWalletTotals = createSelector(selectWalletsState, state => state.totals);
export const getWalletById = (id: string) => createSelector(selectWalletsState, state => state.wallets.find((wallet: DisplayWallet) => wallet.id === id));
