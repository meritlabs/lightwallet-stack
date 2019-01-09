import { DisplayWallet, IDisplayWalletOptions } from '@merit/common/models/display-wallet';
import { IUnlockRequest } from '@merit/common/services/unlock-request.service';
import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

export interface IWalletsState {
  wallets: DisplayWallet[];
  walletsMap: { [walletId: string]: DisplayWallet };
  loading: boolean;
  totals: IWalletTotals;
  totalsLoading: boolean;
  inviteRequests: IUnlockRequest[];
}

export interface IWalletTotals {
  totalNetworkValue: string;
  totalMiningRewards: string;
  totalGrowthRewards: string;
  totalWalletsBalance: string;
  totalWalletsBalanceFiat: string;
  allBalancesHidden: boolean;
  totalCommunitySize: number;
  invites: number;
}

const DEFAULT_STATE: IWalletsState = {
  wallets: [],
  walletsMap: {},
  totals: {
    totalNetworkValue: '0.00',
    totalMiningRewards: '0.00',
    totalGrowthRewards: '0.00',
    totalWalletsBalance: '0.00',
    totalWalletsBalanceFiat: '0.00',
    allBalancesHidden: false,
    totalCommunitySize: 0,
    invites: 0,
  },
  loading: true,
  totalsLoading: true,
  inviteRequests: [],
};

export enum WalletsActionType {
  Add = '[Wallets] Add',
  Update = '[Wallets] Update',
  UpdateOne = '[Wallets] Update one',
  Refresh = '[Wallets] Refresh',
  RefreshOne = '[Wallets] Refresh one',
  RefreshTotals = '[Wallets] Refresh totals',
  UpdateTotals = '[Wallets] Update totals',
  UpdateInviteRequests = '[Wallets] Update Invite Wait List',
  DeleteWallet = '[Wallets] Delete wallet',
  DeleteWalletCompleted = '[Wallets] Delete wallet completed',
  IgnoreInviteRequest = '[Wallets] Ignore invite request',
}

export class AddWalletAction implements Action {
  type = WalletsActionType.Add;

  constructor(public wallet: DisplayWallet) {}
}

export class UpdateWalletsAction implements Action {
  type = WalletsActionType.Update;
  totals: any;
  walletsMap: any = {};

  constructor(public payload: DisplayWallet[]) {
    payload.forEach(w => (this.walletsMap[w.id] = w));
  }
}

export class UpdateOneWalletAction implements Action {
  type = WalletsActionType.UpdateOne;

  constructor(public wallet: DisplayWallet, public opts: IDisplayWalletOptions = {}) {}
}

export class RefreshWalletsAction implements Action {
  type = WalletsActionType.Refresh;
}

export class RefreshOneWalletAction implements Action {
  type = WalletsActionType.RefreshOne;

  constructor(public walletId: string, public opts: IDisplayWalletOptions = {}) {}
}

export class UpdateWalletTotalsAction implements Action {
  type = WalletsActionType.UpdateTotals;

  constructor(public totals: IWalletTotals) {}
}

export class DeleteWalletAction implements Action {
  type = WalletsActionType.DeleteWallet;
  constructor(public walletId: string) {}
}

export class DeleteWalletCompletedAction implements Action {
  type = WalletsActionType.DeleteWalletCompleted;
  constructor(public walletId: string) {}
}

export class UpdateInviteRequestsAction implements Action {
  type = WalletsActionType.UpdateInviteRequests;

  constructor(public inviteRequests: IUnlockRequest[]) {}
}

export class IgnoreInviteRequestAction implements Action {
  type = WalletsActionType.IgnoreInviteRequest;
  constructor(public address: string) {}
}

export type WalletsAction = AddWalletAction &
  UpdateWalletsAction &
  RefreshWalletsAction &
  UpdateOneWalletAction &
  RefreshOneWalletAction &
  UpdateWalletTotalsAction &
  UpdateInviteRequestsAction &
  DeleteWalletAction &
  DeleteWalletCompletedAction &
  IgnoreInviteRequestAction;

export function walletsReducer(state: IWalletsState = DEFAULT_STATE, action: WalletsAction) {
  switch (action.type) {
    case WalletsActionType.Add:
      const newWallet: DisplayWallet = action.wallet;
      return {
        ...state,
        loading: false,
        walletsMap: {
          ...state.walletsMap,
          [newWallet.id]: newWallet,
        },
        wallets: [...state.wallets, newWallet],
        totalsLoading: true,
      };

    case WalletsActionType.Refresh:
      return {
        ...state,
        loading: true,
      };

    case WalletsActionType.Update:
      return {
        ...state,
        loading: false,
        wallets: action.payload,
        walletsMap: action.walletsMap,
      };

    case WalletsActionType.UpdateOne:
      const index: number = state.wallets.findIndex((w: DisplayWallet) => w.id === action.wallet.id);
      state.wallets[index] = action.wallet;
      return {
        ...state,
        wallets: [...state.wallets],
        loading: false,
        walletsMap: {
          ...state.walletsMap,
          [action.wallet.id]: action.wallet,
        },
      };

    case WalletsActionType.RefreshTotals:
      return {
        ...state,
        totalsLoading: true,
      };

    case WalletsActionType.UpdateTotals:
      return {
        ...state,
        totalsLoading: false,
        totals: action.totals,
      };

    case WalletsActionType.UpdateInviteRequests:
      return {
        ...state,
        inviteRequests: action.inviteRequests,
      };

    case WalletsActionType.DeleteWalletCompleted:
      return {
        ...state,
        wallets: state.wallets.filter(wallet => wallet.id !== action.walletId),
        walletsMap: {
          ...state.walletsMap,
          [action.walletId]: undefined,
        },
      };

    default:
      return state;
  }
}

export const selectWalletsState = createFeatureSelector<IWalletsState>('wallets');
export const selectWalletsLoading = createSelector(selectWalletsState, state => state.loading);
export const selectWallets = createSelector(selectWalletsState, state => state.wallets);
export const selectConfirmedWallets = createSelector(selectWallets, wallets =>
  wallets.filter((w: DisplayWallet) => w.client.confirmed),
);
export const selectWalletTotals = createSelector(selectWalletsState, state => state.totals);
export const selectWalletTotalsLoading = createSelector(selectWalletsState, state => state.totalsLoading);
export const selectWalletById = (id: string) => createSelector(selectWalletsState, state => state.walletsMap[id]);
export const selectWalletsWithInvites = createSelector(selectWallets, (wallets: DisplayWallet[]) =>
  wallets.filter(wallet => wallet.availableInvites > 0),
);
export const selectInvites = createSelector(selectWalletTotals, totals => totals.invites);
export const selectInviteRequests = createSelector(selectWalletsState, state => state.inviteRequests);
export const selectNumberOfInviteRequests = createSelector(selectInviteRequests, inviteRequests => {
  if (!inviteRequests) return '0';
  if (inviteRequests.length > 99) return '99+';
  return inviteRequests.length.toString();
});

export const selectNumberOfWallets = createSelector(selectWallets, wallets => wallets.length);
