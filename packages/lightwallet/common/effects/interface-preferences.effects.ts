import { Injectable } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import {
  InterfaceActionType,
  selectPrimaryWallet,
  SetPrimaryWalletAction
} from '@merit/common/reducers/interface-preferences.reducer';
import { selectWallets } from '@merit/common/reducers/wallets.reducer';
import { PersistenceService2, UserSettingsKey } from '@merit/common/services/persistence2.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { filter, map, skip, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
export class InterfacePreferencesEffects {
  @Effect({ dispatch: false })
  setPrimaryWallet: Observable<any> = this.actions$
    .pipe(
      ofType(InterfaceActionType.SetPrimaryWallet),
      skip(1), // the init function emits this action, we can skip the first one
      switchMap((action: SetPrimaryWalletAction) => {
        if (action.primaryWallet) {
          return of(action.primaryWallet);
        }

        return this.store.select(selectWallets)
          .pipe(
            take(1),
            map((wallets: DisplayWallet[]) =>
              wallets[0]
            )
          );
      }),
      filter((wallet: DisplayWallet) => !!wallet),
      tap((wallet: DisplayWallet) => this.persistenceService.setUserSettings(UserSettingsKey.primaryWalletID, wallet.id))
    );

  @Effect()
  init$: Observable<any> = fromPromise(this.persistenceService.getUserSettings(UserSettingsKey.primaryWalletID))
    .pipe(
      switchMap((walletId: string) => {
        return this.store.select(selectWallets)
          .pipe(
            filter(wallets => wallets && wallets.length > 0),
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
              private store: Store<IRootAppState>) {
  }
}
