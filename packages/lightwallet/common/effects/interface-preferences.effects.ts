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
import { of } from 'rxjs/observable/of';
import { filter, map, skip, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class InterfacePreferencesEffects {
  @Effect({ dispatch: false })
  setPrimaryWallet: Observable<any> = this.actions$
    .pipe(
      ofType(InterfaceActionType.SetPrimaryWallet),
      skip(1), // the init function emits this action, we can skip the first one
      tap((action: SetPrimaryWalletAction) => this.persistenceService.setUserSettings(UserSettingsKey.primaryWalletID, action.primaryWallet))
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
            primaryWallet = confirmedWallet.id;
          }
        }

        return new SetPrimaryWalletAction(primaryWallet);
      })
    );

  @Effect()
  init$: Observable<any> = fromPromise(this.persistenceService.getUserSettings(UserSettingsKey.primaryWalletID))
    .pipe(
      switchMap((walletId: string) => {
        if (walletId) {
          return of(walletId);
        }

        return this.store.select(selectWallets)
          .pipe(
            filter(wallets => wallets.length > 0),
            take(1),
            map((wallets: DisplayWallet[]) => {
              const confirmedWallet: DisplayWallet = wallets.find(wallet => wallet.confirmed);

              if (confirmedWallet) {
                return confirmedWallet.id;
              }
            })
          );
      }),
      map((walletId: string) => new SetPrimaryWalletAction(walletId))
    );

  constructor(private actions$: Actions,
              private persistenceService: PersistenceService2,
              private store: Store<IRootAppState>) {}
}
