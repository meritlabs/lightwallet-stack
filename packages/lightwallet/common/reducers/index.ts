import { walletsReducer, WalletsState } from '@merit/common/reducers/wallets.reducer';
import { combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

export interface IAppState {
  wallets: WalletsState;
}

const reducers = {
  wallets: walletsReducer
};

const combinedReducer = combineReducers(reducers);

export function reducer(state: any, action: any) {
  console.log('GOT ACTION', state, action);
  return combinedReducer(state, action);
}

export const selectWalletsState = createFeatureSelector<WalletsState>('wallets');
export const getWalletsLoading = createSelector(selectWalletsState, state => state.loading);
export const getWallets = createSelector(selectWalletsState, state => state.wallets);
