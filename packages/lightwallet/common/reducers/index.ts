import { walletsReducer, WalletsState } from '@merit/common/reducers/wallets.reducer';
import { combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

export interface IAppState {
  wallets: WalletsState;
}

export const reducer = {
  wallets: walletsReducer
};

export const selectWalletsState = createFeatureSelector<WalletsState>('wallets');
export const getWalletsLoading = createSelector(selectWalletsState, state => state.loading);
export const getWallets = createSelector(selectWalletsState, state => state.wallets);
export const getWalletTotals = createSelector(selectWalletsState, state => state.totals);
