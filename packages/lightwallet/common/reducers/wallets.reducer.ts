import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { formatAmount } from '@merit/common/utils/format';

export interface IWalletsState {
  wallets: DisplayWallet[];
  walletsMap: { [walletId: string]: DisplayWallet; };
  loading: boolean;
  totals: any;
}

export enum WalletsActionType {
  Add = '[Wallets] Add',
  Update = '[Wallets] Update',
  Refresh = '[Wallets] Refresh',
  UpdateOne = '[Wallets] Update one'
}

export class AddWalletAction implements Action {
  type = WalletsActionType.Add;

  constructor(public payload: DisplayWallet) {
  }
}

export class UpdateWalletsAction implements Action {
  type = WalletsActionType.Update;
  totals: any;
  walletsMap: any = {};

  constructor(public payload: DisplayWallet[]) {
    const totalMicros: any = {
      totalNetworkValue: 0,
      totalMiningRewards: 0,
      totalAmbassadorRewards: 0,
      totalWalletsBalance: 0
    };

    payload.forEach(w => {
      totalMicros.totalNetworkValue += w.totalNetworkValueMicro;
      totalMicros.totalMiningRewards += w.miningRewardsMicro;
      totalMicros.totalAmbassadorRewards += w.ambassadorRewardsMicro;

      this.walletsMap[w.id] = w;
    });

    this.totals = {
      totalNetworkValue: formatAmount(totalMicros.totalNetworkValue, 'mrt', {}),
      totalMiningRewards: formatAmount(totalMicros.totalMiningRewards, 'mrt', {}),
      totalAmbassadorRewards: formatAmount(totalMicros.totalAmbassadorRewards, 'mrt', {})
    };
  }
}

export class RefreshWalletsAction implements Action {
  type = WalletsActionType.Refresh;
}

export type WalletsAction = AddWalletAction | UpdateWalletsAction | RefreshWalletsAction;

const DEFAULT_STATE: IWalletsState = {
  wallets: [],
  walletsMap: {},
  loading: false,
  totals: {
    totalNetworkValue: 0,
    totalMiningRewards: 0,
    totalAmbassadorRewards: 0
  }
};

export function walletsReducer(state: IWalletsState = DEFAULT_STATE, action: WalletsAction) {
  switch (action.type) {
    case WalletsActionType.Add:
      const newWallet: DisplayWallet = (action as AddWalletAction).payload;
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
        totals: {
          totalNetworkValue: state.totals.totalNetworkValue + newWallet.totalNetworkValueMicro,
          totalMiningRewards: state.totals.totalMiningRewards + newWallet.miningRewardsMicro,
          totalAmbassadorRewards: state.totals.totalAmbassadorRewards + newWallet.ambassadorRewardsMicro
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
        totals: (action as UpdateWalletsAction).totals,
        walletsMap: (action as UpdateWalletsAction).walletsMap
      };

    default:
      return state;
  }
}

export const selectWalletsState = createFeatureSelector<IWalletsState>('wallets');
export const selectWalletsLoading = createSelector(selectWalletsState, state => state.loading);
export const selectWallets = createSelector(selectWalletsState, state => state.wallets);
export const selectWalletTotals = createSelector(selectWalletsState, state => state.totals);
export const selectWalletById = (id: string) => createSelector(selectWalletsState, state => state.walletsMap[id]);
