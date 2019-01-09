import { Injectable } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { IRootAppState } from '@merit/common/reducers';
import {
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
  UpdateOneWalletAction,
  WalletsActionType,
} from '@merit/common/reducers/wallets.reducer';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { formatWalletHistory } from '@merit/common/utils/transactions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { flatten } from 'lodash';
import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { distinctUntilKeyChanged, filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { FeeService } from '@merit/common/services/fee.service';

@Injectable()
export class TransactionEffects {
  @Effect()
  refreshOnWalletRefresh$: Observable<RefreshOneWalletTransactions> = this.actions$.pipe(
    ofType(WalletsActionType.Add),
    map((action: AddWalletAction) => new RefreshOneWalletTransactions(action.wallet.id)),
  );

  @Effect()
  refreshOnWalletsRefresh$: Observable<RefreshTransactionsAction> = this.actions$.pipe(
    ofType(WalletsActionType.Update, WalletsActionType.DeleteWallet),
    map(() => new RefreshTransactionsAction()),
  );

  @Effect()
  refresh$: Observable<UpdateTransactionsAction> = this.actions$.pipe(
    ofType(TransactionActionType.Refresh),
    withLatestFrom(this.store.select(selectWallets)),
    switchMap(([action, wallets]) => Observable.fromPromise(Promise.all(wallets.map(w => this.getWalletHistory(w))))),
    map((transactionsList: IDisplayTransaction[][]) => new UpdateTransactionsAction(flatten(transactionsList))),
  );

  @Effect()
  refreshOne$: Observable<UpdateOneWalletTransactions> = this.actions$.pipe(
    ofType(TransactionActionType.RefreshOne),
    switchMap((action: RefreshOneWalletTransactions) =>
      this.store.select(selectWalletById(action.walletId)).pipe(
        take(1),
        switchMap((wallet: DisplayWallet) => Observable.fromPromise(this.getWalletHistory(wallet))),
        map((transactions: IDisplayTransaction[]) => new UpdateOneWalletTransactions(action.walletId, transactions)),
      ),
    ),
  );

  @Effect()
  refreshOnStatusRefresh$: Observable<RefreshOneWalletTransactions> = this.actions$.pipe(
    ofType(WalletsActionType.UpdateOne),
    filter((action: UpdateOneWalletAction) => !action.opts.skipStatus),
    map((action: UpdateOneWalletAction) => action.wallet),
    distinctUntilKeyChanged('status'),
    map((wallet: DisplayWallet) => new RefreshOneWalletTransactions(wallet.id)),
  );

  constructor(
    private actions$: Actions,
    private walletService: WalletService,
    private store: Store<IRootAppState>,
    private persistenceService: PersistenceService2,
    private feeService: FeeService,
  ) {}

  private async getWalletHistory(wallet: DisplayWallet): Promise<IDisplayTransaction[]> {
    const walletHistory = await wallet.client.getTxHistory({ includeExtendedInfo: true }); // TODO (ibby: add this and do infinite loading --> { skip: 0, limit: 50, includeExtendedInfo: true } )
    const easySends = await this.persistenceService.getEasySends();
    return formatWalletHistory(walletHistory, wallet.client, easySends, this.feeService, null, this.persistenceService);
  }
}
