import { Injectable } from '@angular/core';
import { createDisplayWallet, DisplayWallet, updateDisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import {
  IWalletTotals,
  RefreshOneWalletAction,
  selectWallets,
  UpdateOneWalletAction,
  UpdateWalletsAction,
  UpdateWalletTotalsAction,
  WalletsActionType
} from '@merit/common/reducers/wallets.reducer';
import { AddressService } from '@merit/common/services/address.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { formatAmount } from '@merit/common/utils/format';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { distinctUntilChanged, map, skip, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class WalletEffects {
  @Effect()
  refresh$: Observable<UpdateWalletsAction> = this.actions$.pipe(
    ofType(WalletsActionType.Refresh),
    switchMap(() => Observable.fromPromise(this.updateAllWallets())),
    map((wallets: DisplayWallet[]) => new UpdateWalletsAction(wallets))
  );

  @Effect()
  refreshOne$: Observable<UpdateOneWalletAction> = this.actions$.pipe(
    ofType(WalletsActionType.RefreshOne),
    switchMap((action: RefreshOneWalletAction) => fromPromise(updateDisplayWallet(action.wallet, action.opts))),
    map((wallet: DisplayWallet) => new UpdateOneWalletAction(wallet))
  );

  // TODO(ibby): update totals only if the numbers we depend on changed --> use distinct/distinctUntilChanged operators
  // TODO(ibby): investigate why Typescript doesn't like [action: Action, wallets: DisplayWallets[]] as args in map
  // function
  @Effect()
  updateTotals$: Observable<UpdateWalletTotalsAction> = this.actions$.pipe(
    ofType(WalletsActionType.Update, WalletsActionType.UpdateOne),
    withLatestFrom(this.store.select(selectWallets)),
    map((args: any[]) => new UpdateWalletTotalsAction(this.calculateTotals(args[1])))
  );


  // TODO(ibby): only update preferences for the wallet that had a change, not all wallets
  @Effect({ dispatch: false })
  savePreferences$: Observable<any> = this.actions$.pipe(
    ofType(WalletsActionType.Update, WalletsActionType.UpdateOne),
    withLatestFrom(this.store.select(selectWallets)),
    map((args: any[]) => args[1].map((wallet: DisplayWallet) => wallet.exportPreferences())),
    distinctUntilChanged(),
    skip(1),
    switchMap((preferences: any[]) => fromPromise(
      Promise.all(preferences.map(this.persistenceService.saveWalletPreferences.bind(this.persistenceService)))
    ))
  );

  constructor(private actions$: Actions,
              private walletService: WalletService,
              private addressService: AddressService,
              private profileService: ProfileService,
              private txFormatService: TxFormatService,
              private store: Store<IRootAppState>,
              private persistenceService: PersistenceService2) {
  }

  private async updateAllWallets(): Promise<DisplayWallet[]> {
    const wallets = await this.profileService.getWallets();
    return Promise.all<DisplayWallet>(
      wallets.map(async w => {
        const displayWallet = await createDisplayWallet(w, this.walletService, this.addressService, this.txFormatService);
        displayWallet.importPreferences(await this.persistenceService.getWalletPreferences(displayWallet.id));
        return displayWallet;
      })
    );
  }

  private calculateTotals(wallets: DisplayWallet[]): IWalletTotals {
    const totals: any = {
      totalAmbassadorRewards: 0,
      totalMiningRewards: 0,
      totalNetworkValue: 0,
      totalWalletsBalance: 0
    };

    let allBalancesHidden = true;

    wallets.forEach(w => {
      totals.totalNetworkValue += w.totalNetworkValueMicro;
      totals.totalMiningRewards += w.miningRewardsMicro;
      totals.totalAmbassadorRewards += w.ambassadorRewardsMicro;

      if (!w.balanceHidden) {
        allBalancesHidden = false;
        totals.totalWalletsBalance += w.totalBalanceMicros;
      }
    });

    return {
      totalNetworkValue: formatAmount(totals.totalNetworkValue, 'mrt'),
      totalMiningRewards: formatAmount(totals.totalMiningRewards, 'mrt'),
      totalAmbassadorRewards: formatAmount(totals.totalAmbassadorRewards, 'mrt'),
      totalWalletsBalance: formatAmount(totals.totalWalletsBalance, 'mrt'),
      totalWalletsBalanceFiat: this.txFormatService.formatAlternativeStr(totals.totalWalletsBalance),
      allBalancesHidden
    };
  }
}
