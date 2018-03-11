import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { sortBy, uniqBy } from 'lodash';

export interface ITransactionsState {
  transactions: IDisplayTransaction[];
  transactionsByWallet: {
    [walletId: string]: IDisplayTransaction[];
  };
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
  transactionsByWallet: any = {};

  constructor(public transactions: IDisplayTransaction[]) {
    let walletId: string;

    transactions.forEach((transaction: IDisplayTransaction) => {
      walletId = transaction.displayWallet.id;

      if (!this.transactionsByWallet[walletId])
        this.transactionsByWallet[walletId] = [];

      this.transactionsByWallet[walletId].push(transaction);
    });

    this.transactions = sortBy(this.transactions, 'time').reverse();
  }
}

export class UpdateOneWalletTransactions implements Action {
  type: TransactionActionType.UpdateOne;

  constructor(public walletId: string, public transactions: IDisplayTransaction[]) {

  }
}

export class RefreshOneWalletTransactions implements Action {
  type: TransactionActionType.RefreshOne;

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
  transactionsByWallet: {},
  loading: false
};

export function transactionsReducer(state: ITransactionsState = DEFAULT_STATE, action: TransactionsReducerAction) {
  switch (action.type) {
    case TransactionActionType.Refresh:
      return {loading: true};

    case TransactionActionType.Update:
      return {
        transactions: action.transactions,
        transactionsByWallet: action.transactionsByWallet
      };

    case TransactionActionType.RefreshOne:
      return state;

    case TransactionActionType.UpdateOne:
      return {
        transactions: sortBy(uniqBy(state.transactions.concat(action.transactions), 'txid'), 'time').reverse(),
        transactionsByWallet: {
          ...state.transactionsByWallet,
          [action.walletId]: state.transactions
        }
      };

    default:
      return state;
  }
}

export const selectTransactionsState = createFeatureSelector<ITransactionsState>('transactions');
export const selectTransactionsLoading = createSelector(selectTransactionsState, state => state.loading);
export const selectTransactions = createSelector(selectTransactionsState, state => state.transactions);
export const selectTransactionsByWalletId = (id: string) => createSelector(selectTransactionsState, state => state.transactionsByWallet[id]);
