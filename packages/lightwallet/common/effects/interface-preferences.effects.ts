import { Injectable } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import {
  InterfaceActionType,
  RefreshPrimaryWalletAction,
  selectPrimaryWallet,
  SetPrimaryWalletAction
} from '@merit/common/reducers/interface-preferences.reducer';
import { selectWallets, UpdateOneWalletAction, WalletsActionType } from '@merit/common/reducers/wallets.reducer';
import { PersistenceService2, UserSettingsKey } from '@merit/common/services/persistence2.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { filter, map, skip, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class InterfacePreferencesEffects {
  @Effect({ dispatch: false })
  setPrimaryWallet: Observable<any> = this.actions$
    .pipe(
      ofType(InterfaceActionType.SetPrimaryWallet),
      skip(1), // the init function emits this action, we can skip the first one
      tap((action: SetPrimaryWalletAction) => this.persistenceService.setUserSettings(UserSettingsKey.primaryWalletID, action.primaryWallet.id))
    );

  @Effect()
  watchUnconfirmedWallet: Observable<any> = this.store.select(selectPrimaryWallet)
    .pipe(
      filter((wallet: DisplayWallet) => !!wallet && !wallet.confirmed),
      switchMap((primaryWallet: DisplayWallet) =>
        this.actions$.pipe(
          ofType(WalletsActionType.UpdateOne),
          filter((action: UpdateOneWalletAction) => action.wallet.id === primaryWallet.id && action.wallet.confirmed),
          map(() => new RefreshPrimaryWalletAction())
        )
      )
    );

  @Effect()
  refreshPrimaryWallet: Observable<any> = this.actions$
    .pipe(
      ofType(InterfaceActionType.RefreshPrimaryWallet),
      withLatestFrom(this.store.select(selectPrimaryWallet), this.store.select(selectWallets).pipe(filter(wallets => wallets.length > 0))),
      map(([_, primaryWallet, wallets]) => {
        if (!primaryWallet) {
          const confirmedWallet: DisplayWallet = wallets.find(wallet => wallet.confirmed);

          if (confirmedWallet) {
            primaryWallet = confirmedWallet;
          } else {
            primaryWallet = wallets[0];
          }
        }

        return new SetPrimaryWalletAction(primaryWallet);
      })
    );

  @Effect()
  init$: Observable<any> = fromPromise(this.persistenceService.getUserSettings(UserSettingsKey.primaryWalletID))
    .pipe(
      switchMap((walletId: string) => {
        return this.store.select(selectWallets)
          .pipe(
            filter(wallets => wallets.length > 0),
            take(1),
            map((wallets: DisplayWallet[]) => {
              let wallet: DisplayWallet;

              if (walletId) {
                wallet = wallets.find(wallet => wallet.id === walletId);
              } else {
                wallet = wallets.find(wallet => wallet.confirmed);
              }

              if (!wallet) {
                wallet = wallets[0];
              }

              // return any wallet if we don't have a confirmed one
              return wallet;
            })
          );
      }),
      map((wallet: DisplayWallet) => new SetPrimaryWalletAction(wallet))
    );

  constructor(private actions$: Actions,
              private persistenceService: PersistenceService2,
              private store: Store<IRootAppState>) {}
}
