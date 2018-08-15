import { appReducer, IAppState } from '@merit/common/reducers/app.reducer';
import { goalsReducer, IGoalsState } from '@merit/common/reducers/goals.reducer';
import { IInterfaceState, interfaceReducer } from '@merit/common/reducers/interface-preferences.reducer';
import { INotificationsState, notificationsReducer } from '@merit/common/reducers/notifications.reducer';
import { ITransactionsState, transactionsReducer } from '@merit/common/reducers/transactions.reducer';
import { IWalletsState, walletsReducer } from '@merit/common/reducers/wallets.reducer';

export interface IRootAppState {
  app: IAppState;
  wallets: IWalletsState;
  transactions: ITransactionsState;
  notifications: INotificationsState;
  interface: IInterfaceState;
  goals: IGoalsState;
}

export const reducer = {
  wallets: walletsReducer,
  app: appReducer,
  transactions: transactionsReducer,
  notifications: notificationsReducer,
  interface: interfaceReducer,
  goals: goalsReducer,
};

export const mobileAppReducer = {
  wallets: walletsReducer,
  app: appReducer,
  transactions: transactionsReducer,
  notifications: notificationsReducer,
};
