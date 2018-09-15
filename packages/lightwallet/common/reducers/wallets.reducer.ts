import { DisplayWallet, IDisplayWalletOptions } from '@merit/common/models/display-wallet';
import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { InviteRequest } from '@merit/common/services/invite-request.service';
import { IRankData, IRankInfo } from '@merit/common/models/rank';

export interface IWalletsState {
  wallets: DisplayWallet[];
  walletsMap: { [walletId: string]: DisplayWallet; };
  loading: boolean;
  totals: IWalletTotals;
  totalsLoading: boolean;
  inviteRequests: InviteRequest[];
  rankData: IRankData;
}

export interface IWalletTotals {
  totalNetworkValue: string;
  totalMiningRewards: string;
  totalGrowthRewards: string;
  totalWalletsBalance: string;
  totalWalletsBalanceFiat: string;
  allBalancesHidden: boolean;
  invites: number;
  communitySize: number;
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
    invites: 0,
    communitySize: 0,
  },
  loading: true,
  totalsLoading: true,
  inviteRequests: [],
  rankData: {} as IRankData,
};

export enum WalletsActionType {
  Init = '[Wallets] Init',
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
  UpdateRankData = '[Wallets] Update rank data',
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

  constructor(public wallets: DisplayWallet[]) {
    wallets.forEach(w => this.walletsMap[w.id] = w);
  }
}


export class InitWalletsAction extends UpdateWalletsAction {
  readonly type = WalletsActionType.Init;
}

export class UpdateOneWalletAction implements Action {
  readonly type = WalletsActionType.UpdateOne;

  constructor(public wallet: DisplayWallet, public opts: IDisplayWalletOptions = {}) {}
}

export class RefreshWalletsAction implements Action {
  readonly type = WalletsActionType.Refresh;

  constructor(public init?: boolean, public opts: IDisplayWalletOptions = {}) {}
}

export class RefreshOneWalletAction implements Action {
  readonly type = WalletsActionType.RefreshOne;

  constructor(public walletId: string, public opts: IDisplayWalletOptions = {}) {}
}

export class UpdateWalletTotalsAction implements Action {
  readonly type = WalletsActionType.UpdateTotals;

  constructor(public totals: IWalletTotals) {}
}

export class DeleteWalletAction implements Action {
  readonly type = WalletsActionType.DeleteWallet;
  constructor(public walletId: string) {}
}

export class DeleteWalletCompletedAction implements Action {
  readonly type = WalletsActionType.DeleteWalletCompleted;
  constructor(public walletId: string) {}
}

export class UpdateInviteRequestsAction implements Action {
  readonly type = WalletsActionType.UpdateInviteRequests;

  constructor(public inviteRequests: InviteRequest[]) {}
}

export class IgnoreInviteRequestAction implements Action {
  readonly type = WalletsActionType.IgnoreInviteRequest;
  constructor(public address: string) {}
}

export class UpdateRankDataAction implements Action {
  readonly type = WalletsActionType.UpdateRankData;
  constructor(public rankData: IRankData) {}
}

export type WalletsAction =
  AddWalletAction
  & UpdateWalletsAction
  & RefreshWalletsAction
  & UpdateOneWalletAction
  & RefreshOneWalletAction
  & UpdateWalletTotalsAction
  & UpdateInviteRequestsAction
  & DeleteWalletAction
  & DeleteWalletCompletedAction
  & IgnoreInviteRequestAction
  & UpdateRankDataAction;

export function walletsReducer(state: IWalletsState = DEFAULT_STATE, action: WalletsAction) {
  switch (action.type) {
    case WalletsActionType.Add:
      const newWallet: DisplayWallet = action.wallet;
      return {
        ...state,
        loading: false,
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

    case WalletsActionType.Init:
    case WalletsActionType.Update:
      return {
        ...state,
        loading: false,
        wallets: [...action.wallets],
        walletsMap: {...action.walletsMap}
      };

    case WalletsActionType.UpdateOne:
      const index: number = state.wallets.findIndex((w: DisplayWallet) => w.id === action.wallet.id);
      state.wallets[index] = action.wallet;
      return {
        ...state,
        wallets: [
          ...state.wallets
        ],
        loading: false,
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

    case WalletsActionType.UpdateInviteRequests:
      return {
        ...state,
        inviteRequests: action.inviteRequests
      };

    case WalletsActionType.DeleteWalletCompleted:
      return {
        ...state,
        wallets: state.wallets.filter(wallet => wallet.id !== action.walletId),
        walletsMap: {
          ...state.walletsMap,
          [action.walletId]: undefined
        }
      };

    case WalletsActionType.UpdateRankData:
      return {
        ...state,
        rankData: action.rankData,
      };

    default:
      return state;
  }
}

export const selectWalletsState = createFeatureSelector<IWalletsState>('wallets');
export const selectWalletsLoading = createSelector(selectWalletsState, state => state.loading);
export const selectWallets = createSelector(selectWalletsState, state => state.wallets);
export const selectConfirmedWallets = createSelector(selectWallets, wallets => wallets.filter((w: DisplayWallet) => w.confirmed));
export const selectUnconfirmedWallets = createSelector(selectWallets, wallets => wallets.filter((w: DisplayWallet) => !w.confirmed));
export const selectWalletTotals = createSelector(selectWalletsState, state => state.totals);
export const selectWalletTotalsLoading = createSelector(selectWalletsState, state => state.totalsLoading);
export const selectWalletById = (id: string) => createSelector(selectWalletsState, state => state.walletsMap[id]);
export const selectWalletsWithInvites = createSelector(selectWallets, (wallets: DisplayWallet[]) => wallets.filter(wallet => wallet.balance.spendableInvites > 0));
export const selectInvites = createSelector(selectWalletTotals, totals => totals.invites);
export const selectInviteRequests = createSelector(selectWalletsState, state => state.inviteRequests);
export const selectNumberOfInviteRequests = createSelector(selectInviteRequests, inviteRequests => {
  if (!inviteRequests) return '0';
  if (inviteRequests.length > 99) return '99+';
  return inviteRequests.length.toString();
});
export const selectRankData = createSelector(selectWalletsState, state => state.rankData);

export const selectNumberOfWallets = createSelector(selectWallets, wallets => wallets.length);
