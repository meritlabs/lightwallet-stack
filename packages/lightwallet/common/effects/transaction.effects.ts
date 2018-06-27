import { Injectable } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IDisplayTransaction, VisitedTransaction } from '@merit/common/models/transaction';
import { IRootAppState } from '@merit/common/reducers';
import {
  MarkTransactionsAsVisitedAction,
  RefreshOneWalletTransactions,
  RefreshTransactionsAction, selectTransactions,
  TransactionActionType,
  UpdateOneWalletTransactions,
  UpdateTransactionsAction
} from '@merit/common/reducers/transactions.reducer';
import {
  AddWalletAction,
  selectWalletById,
  selectWallets,
  UpdateOneWalletAction,
  WalletsActionType
} from '@merit/common/reducers/wallets.reducer';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { formatWalletHistory } from '@merit/common/utils/transactions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { flatten, uniq } from 'lodash';
import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { distinctUntilKeyChanged, filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { FeeService } from "@merit/common/services/fee.service";

@Injectable()
export class TransactionEffects {
  @Effect()
  refreshOnWalletRefresh$: Observable<RefreshOneWalletTransactions> = this.actions$.pipe(
    ofType(WalletsActionType.Add),
    map((action: AddWalletAction) => new RefreshOneWalletTransactions(action.wallet.id))
  );

  @Effect()
  refreshOnWalletsRefresh$: Observable<RefreshTransactionsAction> = this.actions$.pipe(
    ofType(WalletsActionType.Update, WalletsActionType.DeleteWallet),
    map(() => new RefreshTransactionsAction())
  );

  @Effect()
  refresh$: Observable<UpdateTransactionsAction> = this.actions$.pipe(
    ofType(TransactionActionType.Refresh),
    withLatestFrom(this.store.select(selectWallets)),
    switchMap(([action, wallets]) => Observable.fromPromise(Promise.all(wallets.map(w => this.getWalletHistory(w))))),
    map((transactionsList: IDisplayTransaction[][]) => new UpdateTransactionsAction(flatten(transactionsList)))
  );

  @Effect()
  refreshOne$: Observable<UpdateOneWalletTransactions> = this.actions$.pipe(
    ofType(TransactionActionType.RefreshOne),
    switchMap((action: RefreshOneWalletTransactions) =>
      this.store.select(selectWalletById(action.walletId))
        .pipe(
          take(1),
          switchMap((wallet: DisplayWallet) => Observable.fromPromise(this.getWalletHistory(wallet))),
          map((transactions: IDisplayTransaction[]) => new UpdateOneWalletTransactions(action.walletId, transactions))
        )
    )
  );

  @Effect()
  refreshOnStatusRefresh$: Observable<RefreshOneWalletTransactions> = this.actions$.pipe(
    ofType(WalletsActionType.UpdateOne),
    filter((action: UpdateOneWalletAction) => !action.opts.skipStatus),
    map((action: UpdateOneWalletAction) => action.wallet),
    distinctUntilKeyChanged('status'),
    map((wallet: DisplayWallet) => new RefreshOneWalletTransactions(wallet.id))
  );

  @Effect({ dispatch: false })
  markAsVisited$ = this.actions$.pipe(
    ofType(TransactionActionType.MarkAsVisited),
    switchMap((action: MarkTransactionsAsVisitedAction) =>
      this.store.select(selectTransactions)
        .pipe(
          take(1)
        )
    ),
    map((transactions: IDisplayTransaction[]) => this.updateVisitedTransactions(transactions))
  );

  constructor(private actions$: Actions,
    private walletService: WalletService,
    private store: Store<IRootAppState>,
    private persistenceService: PersistenceService2,
    private feeService: FeeService
  ) {
  }

  private async getWalletHistory(wallet: DisplayWallet): Promise<IDisplayTransaction[]> {
    const walletHistory = await wallet.client.getTxHistory({ includeExtendedInfo: true }); // TODO (ibby: add this and do infinite loading --> { skip: 0, limit: 50, includeExtendedInfo: true } )
    const easySends = await this.persistenceService.getEasySends();
    const visitedTransactions = await this.persistenceService.getVisitedTransactions();
    const formattedHistory: IDisplayTransaction[] = await formatWalletHistory(walletHistory, wallet.client, easySends, this.feeService, null, visitedTransactions);
    await this.updateVisitedTransactions(formattedHistory);
    return formattedHistory;
  }

  private async updateVisitedTransactions(transactions: IDisplayTransaction[]) {
    let visitedTxs = await this.persistenceService.getVisitedTransactions() || [];

    for (let i = 0; i < transactions.length; i++) {
      let tx = transactions[i];
      let oneVisited = visitedTxs.find(visTx => visTx.txid === tx.txid);

      if (oneVisited) {
        // already there increase counter
        if (tx.isInvite && oneVisited.counter < 4) { // invite refreshes the wallet 2 times before user can see it.
          oneVisited.counter++;
          tx.isNew = true;
        } else if (oneVisited.counter < 2) {
          oneVisited.counter++;
          tx.isNew = true;
        } else {
          tx.isNew = false;
        }
      } else {
        tx.isNew = true;
        // add new one in visited
        visitedTxs.push(new VisitedTransaction(tx.txid, 1));
      }
    }

    console.log(visitedTxs);
    return this.persistenceService.setVisitedTransactions(visitedTxs);
  }
}
