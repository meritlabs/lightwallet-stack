import { Injectable } from '@angular/core';
import { createDisplayWallet, DisplayWallet, updateDisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { UpdateAppAction } from '@merit/common/reducers/app.reducer';
import {
  DeleteWalletAction, DeleteWalletCompletedAction,
  IWalletTotals,
  RefreshOneWalletAction,
  selectWalletById,
  selectWallets,
  UpdateInviteRequestsAction,
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
import { distinctUntilChanged, map, mergeMap, skip, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

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
    switchMap((action: RefreshOneWalletAction) =>
      this.store.select(selectWalletById(action.walletId))
        .pipe(
          switchMap((wallet: DisplayWallet) => fromPromise(updateDisplayWallet(wallet, action.opts))),
          take(1)
        )
    ),
    map((wallet: DisplayWallet) => new UpdateOneWalletAction(wallet))
  );

  // TODO(ibby): update totals only if the numbers we depend on changed --> use distinct/distinctUntilChanged operators
  @Effect()
  updateTotals$: Observable<UpdateWalletTotalsAction> = this.actions$.pipe(
    ofType(WalletsActionType.Update, WalletsActionType.UpdateOne, WalletsActionType.Add),
    withLatestFrom(this.store.select(selectWallets)),
    map(([action, wallets]) => new UpdateWalletTotalsAction(this.calculateTotals(wallets)))
  );

  @Effect()
  updateInviteRequests$: Observable<UpdateInviteRequestsAction> = this.actions$.pipe(
    ofType(WalletsActionType.UpdateOne, WalletsActionType.Update, WalletsActionType.Add),
    withLatestFrom(this.store.select(selectWallets)),
    map(([action, wallets]) => wallets.reduce((requests, wallet) => requests.concat(wallet.inviteRequests), [])),
    map((inviteRequests: any[]) => new UpdateInviteRequestsAction(inviteRequests))
  );

  // TODO(ibby): only update preferences for the wallet that had a change, not all wallets
  @Effect({ dispatch: false })
  savePreferences$: Observable<any> = this.actions$.pipe(
    ofType(WalletsActionType.Update, WalletsActionType.UpdateOne, WalletsActionType.Add),
    withLatestFrom(this.store.select(selectWallets)),
    map((args: any[]) => args[1].map((wallet: DisplayWallet) => wallet.exportPreferences())),
    distinctUntilChanged(),
    skip(1),
    switchMap((preferences: any[]) => fromPromise(
      Promise.all(preferences.map(this.persistenceService.saveWalletPreferences.bind(this.persistenceService)))
    ))
  );

  @Effect()
  deleteWallet$: Observable<any> = this.actions$.pipe(
    ofType(WalletsActionType.DeleteWallet),
    switchMap((action: DeleteWalletAction) => this.store.select(selectWalletById(action.walletId)).pipe(take(1))),
    switchMap((wallet: DisplayWallet) =>
      fromPromise(
        this.profileService.deleteWallet(wallet.client)
          .then(() => this.profileService.isAuthorized())
      )
        .pipe(
          mergeMap((authorized: boolean) => [
            new UpdateAppAction({ authorized }),
            new DeleteWalletCompletedAction(wallet.id)
          ])
        )
    )
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
      totalWalletsBalance: 0,
      totalCommunitySize: 0,
      invites: 0
    };

    let allBalancesHidden = true;

    wallets.forEach(w => {
      totals.totalNetworkValue += w.totalNetworkValueMicro;
      totals.totalMiningRewards += w.miningRewardsMicro;
      totals.totalAmbassadorRewards += w.ambassadorRewardsMicro;
      totals.totalCommunitySize += w.communitySize;
      totals.invites += w.availableInvites;

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
      totalCommunitySize: totals.totalCommunitySize,
      allBalancesHidden,
      invites: totals.invites
    };
  }
}
