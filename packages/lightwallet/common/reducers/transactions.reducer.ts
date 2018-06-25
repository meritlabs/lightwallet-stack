import { IDisplayTransaction, TransactionAction, ITransactionVisit } from '@merit/common/models/transaction';
import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { sortBy, uniqBy } from 'lodash';

export interface ITransactionsState {
  transactions: IDisplayTransaction[];
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
    let lstVisited: ITransactionVisit[] = JSON.parse(localStorage.getItem('lstVisited'));
    let firstTime: boolean;
    if (!lstVisited) {
      lstVisited = [];
      firstTime = true;
    } else {
      firstTime = false;
    }

    this.transactions = sortBy(this.transactions, 'time').reverse();

    this.transactions.forEach((transaction: IDisplayTransaction) => {
      walletId = transaction.wallet.id;

      if (!this.transactionsByWallet[walletId])
        this.transactionsByWallet[walletId] = [];

      this.transactionsByWallet[walletId].push(transaction);

      if (firstTime) {
        let transactionVisit: ITransactionVisit = { txid: transaction.txid, isNew: true };
        lstVisited.push(transactionVisit);
        transaction.isNew = true;
      } else {
        transaction.isNew = true;
        let itemFound = false;
        for (let i = 0; i < lstVisited.length; i++) {
          if (lstVisited[i].txid == transaction.txid) {
            console.log('Item found!');
            itemFound = true;
            transaction.isNew = false;
            break;
          }
        }

        // item not found so lets add it. 
        if (!itemFound) {
          let transactionVisit: ITransactionVisit = { txid: transaction.txid, isNew: true };
          lstVisited.push(transactionVisit);
        }
      }
    });

    //storage save
    localStorage.setItem('lstVisited', JSON.stringify(lstVisited));

  }
}

export class UpdateOneWalletTransactions implements Action {
  type = TransactionActionType.UpdateOne;

  constructor(public walletId: string, public transactions: IDisplayTransaction[]) { }
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
  loading: true
};

export function transactionsReducer(state: ITransactionsState = DEFAULT_STATE, action: TransactionsReducerAction): ITransactionsState {
  switch (action.type) {
    case TransactionActionType.Refresh:
      return {
        ...state,
        loading: true
      };

    case TransactionActionType.Update:
      return {
        transactions: action.transactions,
        loading: false
      };

    case TransactionActionType.UpdateOne:
      return {
        transactions: sortBy(uniqBy(action.transactions.concat(state.transactions), 'txid'), 'time').reverse(),
        loading: false
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
