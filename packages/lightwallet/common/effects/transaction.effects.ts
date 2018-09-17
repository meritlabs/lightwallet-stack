import { Injectable } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IDisplayTransaction, TransactionAction } from '@merit/common/models/transaction';
import { IRootAppState } from '@merit/common/reducers';
import {
  IUTXO,
  RefreshOneWalletTransactions,
  RefreshTransactionsAction,
  TransactionActionType,
  UpdateOneWalletTransactions,
  UpdateTransactionsAction,
} from '@merit/common/reducers/transactions.reducer';
import {
  AddWalletAction,
  selectWalletById,
  selectWallets,
  WalletsActionType,
} from '@merit/common/reducers/wallets.reducer';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { formatWalletHistory } from '@merit/common/utils/transactions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { flatten, orderBy } from 'lodash';
import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { FeeService } from '@merit/common/services/fee.service';
import { IGlobalSendHistory } from '@merit/common/models/globalsend-history.model';


export function getUtxos(transactions: IDisplayTransaction[]): IUTXO[] {
  let spentInputs: any = {};
  return transactions
    .reverse() // arrays get here sorted by timestamp DESC
    .reduce((utxos: IUTXO[], tx: IDisplayTransaction) => {

      let newUtxos = [];

      if (tx.type === 'credit') {
        newUtxos = tx.outputs
          .filter(output => !output.spentTxId)
          .map(output => ({
            txid: tx.txid,
            outputIndex: output.n,
            amount: tx.isInvite ? output.amount : output.amountMicros,
            isInvite: tx.isInvite,
            isPending: tx.isMempool,
            isCoinbase: tx.isCoinbase,
          }));
      } else if (tx.type === 'debit') {
        tx.inputs.forEach(input => spentInputs[input.txid + ',' + input.vout] = true);

        newUtxos = tx.outputs
          .filter(output => output.isChange && !output.spentTxId)
          .map(output => ({
            txid: tx.txid,
            outputIndex: output.n,
            amount: tx.isInvite ? output.amount : output.amountMicros,
            isInvite: tx.isInvite,
            isPending: tx.isMempool,
            isCoinbase: tx.isCoinbase,
          }));
      }

      return utxos.concat(newUtxos);
    }, [])
    .filter((utxo: IUTXO) => !spentInputs[utxo.txid + ',' + utxo.outputIndex]);
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
          map((transactions: IDisplayTransaction[]) =>
            new UpdateOneWalletTransactions(action.walletId, orderBy(transactions, 'time', 'desc'))
          ),
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

      let newHistory = await wallet.client.getHistory(lastBlockHeight);
      let mempoolHistory = await await wallet.client.getMempoolHistory();

      newHistory = orderBy(newHistory, 'time', 'desc');
      mempoolHistory = orderBy(mempoolHistory, 'time', 'desc');

      // Concat new + old history items
      history = [
        ...newHistory,
        ...history,
      ];

      history = orderBy(history, 'time', 'desc');

      // Save transactions to db
      await this.persistenceService.setHistory(wallet.id, history);


      // Add mempool history to the real history
      history = [
        ...mempoolHistory,
        ...history,
      ];

      // Derive UTXOs from wallet history
      let utxos = getUtxos(history);
      let totalGrowthRewards: number = 0,
        totalMiningRewards: number = 0;

      history.forEach(tx => {
        if (typeof tx.amountMicros !== 'number') {
          return;
        }

        if (tx.action === TransactionAction.AMBASSADOR_REWARD) {
          totalGrowthRewards += tx.amountMicros;
        } else if (tx.action === TransactionAction.MINING_REWARD && !tx.isInvite) {
          totalMiningRewards += tx.amountMicros;
        }
      });

      // Update wallet UTXOs to calculate balances + build transactions
      wallet.updateUtxos(utxos);

      // Update Growth + Mining rewards
      wallet.growthRewardsMicro = totalGrowthRewards;
      wallet.miningRewardsMicro = totalMiningRewards;

      const globalSends: IGlobalSendHistory = await wallet.client.getGlobalSendHistory();

      return formatWalletHistory(history, wallet.client, globalSends, this.feeService, null, this.persistenceService);
    } catch (err) {
      console.log('Error refreshing wallet history', err);
      return [];
    }
  }
}
