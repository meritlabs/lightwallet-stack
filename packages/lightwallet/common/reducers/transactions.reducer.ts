import { IDisplayTransaction, TransactionAction } from '@merit/common/models/transaction';
import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { uniqBy } from 'lodash';
import { WalletsAction, WalletsActionType } from '@merit/common/reducers/wallets.reducer';

export interface IUTXO {
  txid: string;
  outputIndex: number;
  amount?: number;
  isInvite: number;
  isPending?: boolean;
  isCoinbase: number;
  /**
   * The script that must be resolved to release the funds
   */
  script?: string;
  /**
   * The address associated to the script.
   */
  address?: string;
}
export type TransactionsByWallet = {
  [walletId: string]: IDisplayTransaction[];
};

export interface ITransactionsState {
  transactions: IDisplayTransaction[];
  transactionsByWallet: TransactionsByWallet;
  loading: boolean;
}

export enum TransactionActionType {
  Update = '[Transactions] Update',
  UpdateOne = '[Transactions] Update one',
  Refresh = '[Transactions] Refresh',
  RefreshOne = '[Transactions] Refresh one'
}

export class RefreshTransactionsAction implements Action {
  type = TransactionActionType.Refresh;
}

export class UpdateTransactionsAction implements Action {
  type = TransactionActionType.Update;
  transactionsByWallet: { [walletId: string]: IDisplayTransaction[] } = {};

  constructor(public transactions: IDisplayTransaction[]) {
    let walletId: string;

    this.transactions.forEach((transaction: IDisplayTransaction) => {
      walletId = transaction.walletId;

      if (!this.transactionsByWallet[walletId])
        this.transactionsByWallet[walletId] = [];

      this.transactionsByWallet[walletId].push(transaction);
    });
  }
}

export class UpdateOneWalletTransactions implements Action {
  type = TransactionActionType.UpdateOne;

  constructor(public walletId: string, public transactions: IDisplayTransaction[]) {
  }
}

export class RefreshOneWalletTransactions implements Action {
  type = TransactionActionType.RefreshOne;

  constructor(public walletId: string) {
  }
}

export type TransactionsReducerAction =
  RefreshTransactionsAction
  & UpdateTransactionsAction
  & UpdateOneWalletTransactions
  & RefreshOneWalletTransactions;

const DEFAULT_STATE: ITransactionsState = {
  transactions: [],
  loading: true,
  transactionsByWallet: {},
};

export function transactionsReducer(state: ITransactionsState = DEFAULT_STATE, action: TransactionsReducerAction & WalletsAction): ITransactionsState {
  switch (action.type) {
    case TransactionActionType.Refresh:
      return {
        ...state,
        loading: true,
      };

    case TransactionActionType.Update:
      return {
        transactions: action.transactions,
        transactionsByWallet: action.transactionsByWallet,
        loading: false,
      };

    case TransactionActionType.UpdateOne:
      return {
        transactions: uniqBy(action.transactions.concat(state.transactions), tx => tx.walletId + tx.txid),
        transactionsByWallet: {
          ...state.transactionsByWallet,
          [action.walletId]: action.transactions,
        },
        loading: false,
      };

    case WalletsActionType.DeleteWallet:
      return {
        transactions: state.transactions.filter(tx => tx.walletId !== action.walletId),
        transactionsByWallet: {
          ...state.transactionsByWallet,
          [action.walletId]: undefined,
        },
        loading: false,
      };

    default:
      return state;
  }


}

export const selectTransactionsState = createFeatureSelector<ITransactionsState>('transactions');
export const selectTransactionsLoading = createSelector(selectTransactionsState, state => state.loading);
export const selectTransactions = createSelector(selectTransactionsState, state => state.transactions);
export const selectSentInvites = createSelector(selectTransactions, (transactions: IDisplayTransaction[]) => transactions.filter(transaction => transaction.action === TransactionAction.SENT && transaction.isInvite));
export const selectTransactionsByWalletId = (id: string) => createSelector(selectTransactionsState, state => state.transactions.filter(tx => tx.walletId === id));
