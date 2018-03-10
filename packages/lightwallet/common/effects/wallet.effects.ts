import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import {
  IWalletTotals,
  RefreshOneWalletAction,
  selectWallets,
  UpdateOneWalletAction,
  UpdateWalletsAction,
  UpdateWalletTotalsAction,
  WalletsActionType
} from '@merit/common/reducers/wallets.reducer';
import { WalletService } from '@merit/common/services/wallet.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { createDisplayWallet, DisplayWallet, updateDisplayWallet } from '@merit/common/models/display-wallet';
import { SendService } from '@merit/common/services/send.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { formatAmount } from '@merit/common/utils/format';
import 'rxjs/add/observable/fromPromise';

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
  // TODO(ibby): investigate why Typescript doesn't like [action: Action, wallets: DisplayWallets[]] as args in map function
  @Effect()
  updateTotals$: Observable<UpdateWalletTotalsAction> = this.actions$.pipe(
    ofType(WalletsActionType.Update, WalletsActionType.UpdateOne),
    withLatestFrom(this.store.select(selectWallets)),
    map((args: any[]) => new UpdateWalletTotalsAction(this.calculateTotals(args[1])))
  );

  constructor(private actions$: Actions,
              private walletService: WalletService,
              private sendService: SendService,
              private profileService: ProfileService,
              private txFormatService: TxFormatService,
              private store: Store<IRootAppState>) {
  }

  private async updateAllWallets(): Promise<DisplayWallet[]> {
    const wallets = await this.profileService.getWallets();
    return Promise.all<DisplayWallet>(
      wallets.map(w => createDisplayWallet(w, this.walletService, this.sendService, this.txFormatService))
    );
  }

  private calculateTotals(wallets: DisplayWallet[]): IWalletTotals {
    const totalMicros: any = {
      totalAmbassadorRewards: 0,
      totalMiningRewards: 0,
      totalNetworkValue: 0,
      totalWalletsBalance: 0
    };

    let allBalancesHidden = true;

    wallets.forEach(w => {
      totalMicros.totalNetworkValue += w.totalNetworkValueMicro;
      totalMicros.totalMiningRewards += w.miningRewardsMicro;
      totalMicros.totalAmbassadorRewards += w.ambassadorRewardsMicro;

      if (!w.balanceHidden) {
        allBalancesHidden = false;
        totalMicros.totalWalletsBalance += w.totalBalanceMicros;
      }
    });

    return {
      totalNetworkValue: formatAmount(totalMicros.totalNetworkValue, 'mrt'),
      totalMiningRewards: formatAmount(totalMicros.totalMiningRewards, 'mrt'),
      totalAmbassadorRewards: formatAmount(totalMicros.totalAmbassadorRewards, 'mrt'),
      totalWalletsBalance: formatAmount(totalMicros.totalWalletsBalance, 'mrt'),
      allBalancesHidden
    };
  }
}
