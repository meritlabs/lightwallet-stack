import { Injectable } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { IRootAppState } from '@merit/common/reducers';
import {
  RefreshOneWalletTransactions,
  RefreshTransactionsAction,
  TransactionActionType,
  UpdateOneWalletTransactions,
  UpdateTransactionsAction
} from '@merit/common/reducers/transactions.reducer';
import {
  AddWalletAction,
  RefreshOneWalletAction,
  selectWalletById,
  selectWallets,
  WalletsActionType
} from '@merit/common/reducers/wallets.reducer';
import { WalletService } from '@merit/common/services/wallet.service';
import { formatWalletHistory } from '@merit/common/utils/transactions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { flatten } from 'lodash';
import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { filter, map, switchMap } from 'rxjs/operators';

@Injectable()
export class TransactionEffects {
  @Effect()
  refreshOnWalletRefresh$: Observable<RefreshOneWalletTransactions> = this.actions$.pipe(
    ofType(WalletsActionType.Add, WalletsActionType.RefreshOne),
    filter((action: AddWalletAction & RefreshOneWalletAction) => action.type != WalletsActionType.RefreshOne || !action.opts.skipStatus),
    map((action: AddWalletAction & RefreshOneWalletAction) => new RefreshOneWalletTransactions(action.wallet ? action.wallet.id : action.walletId))
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
