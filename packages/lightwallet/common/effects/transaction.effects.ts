import { Injectable } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { IRootAppState } from '@merit/common/reducers';
import {
  IUTXO,
  RefreshOneWalletTransactions,
  RefreshTransactionsAction,
  selectTransactionsByWalletId,
  TransactionActionType,
  UpdateOneWalletTransactions,
  UpdateTransactionsAction,
} from '@merit/common/reducers/transactions.reducer';
import {
  AddWalletAction,
  selectWalletById,
  selectWallets,
  UpdateOneWalletAction, UpdateWalletsAction,
  WalletsActionType,
} from '@merit/common/reducers/wallets.reducer';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { formatWalletHistory } from '@merit/common/utils/transactions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { INIT, Store } from '@ngrx/store';
import { flatten, orderBy } from 'lodash';
import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { distinctUntilKeyChanged, filter, map, switchMap, take, withLatestFrom, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { FeeService } from '@merit/common/services/fee.service';
import { IGlobalSendHistory } from '@merit/common/models/globalsend-history.model';


export function getUtxos(transactions: IDisplayTransaction[]): IUTXO[] {
  return transactions
    .reverse() // arrays get here sorted by timestamp DESC
    .reduce((utxos: IUTXO[], tx: IDisplayTransaction) => {

      if (tx.type === 'credit') {
        tx.outputs
          .filter(output => !output.spentTxId)
          .forEach(output => utxos.push({
            txid: tx.txid,
            outputIndex: output.n,
            amount: tx.isInvite? output.amount : output.amountMicros,
            isInvite: tx.isInvite,
            isPending: tx.isMempool,
            isCoinbase: tx.isCoinbase,
          }));
      } else if (tx.type === 'debit') {
        tx.outputs
          .filter(output => output.isChange && !output.spentTxId)
          .forEach(output => utxos.push({
            txid: tx.txid,
            outputIndex: output.n,
            amount: tx.isInvite? output.amount : output.amountMicros,
            isInvite: tx.isInvite,
            isPending: tx.isMempool,
            isCoinbase: tx.isCoinbase,
          }));
      }

      return utxos;
    }, []);
}

@Injectable()
export class TransactionEffects {
  @Effect()
  refreshOnNewWallet$: Observable<RefreshTransactionsAction> = this.actions$.pipe(
    ofType(WalletsActionType.Add),
    map((action: AddWalletAction) => new RefreshOneWalletTransactions(action.wallet.id)),
  );

  @Effect()
  refresh$: Observable<UpdateTransactionsAction> = this.actions$.pipe(
    ofType(TransactionActionType.Refresh),
    withLatestFrom(this.store.select(selectWallets)),
    switchMap(([action, wallets]) =>
      fromPromise(
        Promise.all(
          wallets.map(w => this.refreshWalletHistory(w)),
        ),
      ),
    ),
    map((transactionsList: IDisplayTransaction[][]) =>
      new UpdateTransactionsAction(
        orderBy(
          flatten(transactionsList),
          'time', 'desc'),
      ),
    ),
  );

  @Effect()
  refreshOne$: Observable<UpdateOneWalletTransactions> = this.actions$.pipe(
    ofType(TransactionActionType.RefreshOne),
    switchMap((action: RefreshOneWalletTransactions) =>
      this.store.select(selectWalletById(action.walletId))
        .pipe(
          take(1),
          switchMap((wallet) => fromPromise(this.refreshWalletHistory(wallet))),
          map((transactions: IDisplayTransaction[]) => new UpdateOneWalletTransactions(action.walletId, orderBy(transactions, 'time', 'desc'))),
        ),
    ),
  );

  @Effect()
  init$: Observable<UpdateTransactionsAction> = this.actions$.pipe(
    ofType(WalletsActionType.Init),
    take(1),
    switchMap(() =>
      this.store.select(selectWallets)
        .pipe(
          filter(wallets => wallets && wallets.length > 0),
          take(1),
          tap((wallets) => console.log('Got ' + wallets.length + ' wallets ')),
        ),
    ),
    switchMap((wallets: DisplayWallet[]) =>
      fromPromise(
        Promise.all(
          wallets.map(wallet => this.refreshWalletHistory(wallet)),
        ),
      ),
    ),
    map((transactionsList: IDisplayTransaction[][]) =>
      new UpdateTransactionsAction(orderBy(flatten(transactionsList), 'time', 'desc')),
    ),
  );

  constructor(private actions$: Actions,
              private walletService: WalletService,
              private store: Store<IRootAppState>,
              private persistenceService: PersistenceService2,
              private feeService: FeeService,
  ) {
  }

  private async refreshWalletHistory(wallet: DisplayWallet): Promise<IDisplayTransaction[]> {
    try {
      let history = await this.persistenceService.getHistory(wallet.id);

      const lastTx: IDisplayTransaction = history[0];
      const lastBlockHeight: number = lastTx ? lastTx.height + 1 : 0;

      history = [
        ...await wallet.client.getHistory(lastBlockHeight),
        ...history,
      ];

      history = orderBy(history, 'time', 'desc');
      await this.persistenceService.setHistory(wallet.id, []);

      history = [
        ...await wallet.client.getMempoolHistory(),
        ...history,
      ];

      const utxos = getUtxos(history);
      wallet.updateUtxos(utxos);

      const globalSends: IGlobalSendHistory = await wallet.client.getGlobalSendHistory();

      return formatWalletHistory(history, wallet.client, globalSends, this.feeService, null, this.persistenceService);
    } catch (err) {
      console.log('Error refreshing wallet history', err);
      return [];
    }
  }
}
