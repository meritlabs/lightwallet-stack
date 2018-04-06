import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  AddWalletAction,
  selectWalletById,
  selectWallets, WalletsAction,
  WalletsActionType
} from '@merit/common/reducers/wallets.reducer';
import { Observable } from 'rxjs/Observable';
import {
  RefreshOneWalletTransactions,
  RefreshTransactionsAction,
  TransactionActionType,
  UpdateOneWalletTransactions,
  UpdateTransactionsAction
} from '@merit/common/reducers/transactions.reducer';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { WalletService } from '@merit/common/services/wallet.service';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { flatten } from 'lodash';
import { formatWalletHistory } from '@merit/common/utils/transactions';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class TransactionEffects {
  @Effect()
  refreshOnWalletRefresh$: Observable<RefreshOneWalletTransactions> = this.actions$.pipe(
    ofType(WalletsActionType.Add, WalletsActionType.RefreshOne),
    filter((action: WalletsAction) => action.type != WalletsActionType.RefreshOne || !action.opts.skipStatus),
    map((action: AddWalletAction) => new RefreshOneWalletTransactions(action.wallet.id))
  );

  @Effect()
  refreshOnWalletsRefresh$: Observable<RefreshTransactionsAction> = this.actions$.pipe(
    ofType(WalletsActionType.Refresh),
    map(() => new RefreshTransactionsAction())
  );

  @Effect()
  refresh$: Observable<UpdateTransactionsAction> = this.actions$.pipe(
    ofType(TransactionActionType.Refresh),
    switchMap(() => this.wallets$),
    switchMap((wallets: DisplayWallet[]) => Observable.fromPromise(Promise.all(wallets.map(w => this.getWalletHistory(w))))),
    map((transactionsList: IDisplayTransaction[][]) => new UpdateTransactionsAction(flatten(transactionsList)))
  );

  @Effect()
  refreshOne$: Observable<UpdateOneWalletTransactions> = this.actions$.pipe(
    ofType(TransactionActionType.RefreshOne),
    switchMap((action: RefreshOneWalletTransactions) =>
      this.store.select(selectWalletById(action.walletId))
        .pipe(
          switchMap((wallet: DisplayWallet) => Observable.fromPromise(this.getWalletHistory(wallet))),
          map((transactions: IDisplayTransaction[]) => new UpdateOneWalletTransactions(action.walletId, transactions))
        )
    )
  );

  private wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);

  constructor(private actions$: Actions,
              private walletService: WalletService,
              private store: Store<IRootAppState>) {
  }

  private async getWalletHistory(wallet: DisplayWallet): Promise<IDisplayTransaction[]> {
    const walletHistory = await this.walletService.getTxHistory(wallet.client, { force: true });
    return formatWalletHistory(walletHistory, wallet.client);
  }
}
