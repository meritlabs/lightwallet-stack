import { appReducer, IAppState } from '@merit/common/reducers/app.reducer';
import { walletsReducer, WalletsState } from '@merit/common/reducers/wallets.reducer';

export interface IRootAppState {
  app: IAppState;
  wallets: WalletsState;
}

export const reducer = {
  wallets: walletsReducer,
  app: appReducer
};

