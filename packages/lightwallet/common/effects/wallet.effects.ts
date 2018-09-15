import { Injectable, Optional } from '@angular/core';
import { createDisplayWallet, DisplayWallet, updateDisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { UpdateAppAction } from '@merit/common/reducers/app.reducer';
import {
  DeleteWalletAction,
  DeleteWalletCompletedAction,
  IgnoreInviteRequestAction,
  InitWalletsAction,
  IWalletTotals,
  RefreshOneWalletAction,
  RefreshWalletsAction,
  selectInviteRequests,
  selectWalletById,
  selectWallets,
  UpdateInviteRequestsAction,
  UpdateOneWalletAction,
  UpdateRankDataAction,
  UpdateWalletsAction,
  UpdateWalletTotalsAction,
  WalletsActionType,
} from '@merit/common/reducers/wallets.reducer';
import { AddressService } from '@merit/common/services/address.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
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
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  skip,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { InviteRequest, InviteRequestsService } from '@merit/common/services/invite-request.service';
import { IRankData, IRankInfo } from '@merit/common/models/rank';
import { TransactionActionType } from '@merit/common/reducers/transactions.reducer';
import { defer } from 'rxjs/observable/defer';

const REWARDS_PER_BLOCK: number = 5;

function getPercentileStr(rankData: IRankInfo) {
  const percentile = Number(rankData.percentile);

  return (percentile > 20)
    ? 'Top ' + Math.max(Math.round(100 - percentile), 1) + '%'
    : 'Bottom ' + Math.max(Math.round(percentile), 1) + '%';
}

@Injectable()
export class WalletEffects {
  @Effect()
  refresh$: Observable<UpdateWalletsAction> = this.actions$.pipe(
    ofType(WalletsActionType.Refresh),
    withLatestFrom(this.store.select(selectWallets)),
    switchMap(([action, wallets]) =>
      Promise.all(
        wallets.map(wallet =>
          updateDisplayWallet(wallet, (action as RefreshWalletsAction).opts),
        ),
      ),
    ),
    map((wallets: DisplayWallet[]) => new UpdateWalletsAction(wallets)),
  );

  @Effect()
  refreshOne$: Observable<UpdateOneWalletAction> = this.actions$.pipe(
    ofType(WalletsActionType.RefreshOne),
    switchMap((action: RefreshOneWalletAction) =>
      this.store.select(selectWalletById(action.walletId))
        .pipe(
          take(1),
          switchMap((wallet: DisplayWallet) => fromPromise(updateDisplayWallet(wallet, action.opts))),
        ),
    ),
    map((wallet: DisplayWallet) => new UpdateOneWalletAction(wallet)),
  );

  // TODO(ibby): update totals only if the numbers we depend on changed --> use distinct/distinctUntilChanged operators
  @Effect()
  updateTotals$: Observable<UpdateWalletTotalsAction> = this.actions$.pipe(
    ofType(WalletsActionType.Update, WalletsActionType.UpdateOne, WalletsActionType.Add, WalletsActionType.DeleteWallet, TransactionActionType.Update),
    withLatestFrom(this.store.select(selectWallets)),
    map(([action, wallets]) => new UpdateWalletTotalsAction(this.calculateTotals(wallets))),
  );

  @Effect()
  updateRankData$: Observable<UpdateRankDataAction> = this.actions$.pipe(
    ofType(WalletsActionType.Update, WalletsActionType.UpdateOne, WalletsActionType.Add, WalletsActionType.DeleteWallet),
    withLatestFrom(this.store.select(selectWallets)),
    switchMap(([action, wallets]) =>
      fromPromise(this.calculateRankData(wallets)),
    ),
    map(rankData => new UpdateRankDataAction(rankData)),
  );

  @Effect()
  updateInviteRequests$: Observable<UpdateInviteRequestsAction> = this.actions$.pipe(
    ofType(WalletsActionType.UpdateOne, WalletsActionType.Update, WalletsActionType.Add, WalletsActionType.DeleteWallet),
    withLatestFrom(this.store.select(selectWallets)),
    map(([action, wallets]) => wallets.reduce((requests, wallet) => requests.concat(wallet.inviteRequests), [])),
    map((inviteRequests: any[]) => new UpdateInviteRequestsAction(inviteRequests)),
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
      Promise.all(preferences.map(this.persistenceService2.saveWalletPreferences.bind(this.persistenceService2))),
    )),
  );

  @Effect()
  deleteWallet$: Observable<any> = this.actions$.pipe(
    ofType(WalletsActionType.DeleteWallet),
    switchMap((action: DeleteWalletAction) => this.store.select(selectWalletById(action.walletId)).pipe(take(1))),
    switchMap((wallet: DisplayWallet) =>
      fromPromise(
        this.profileService.deleteWallet(wallet.client)
          .then(() => this.profileService.isAuthorized()),
      )
        .pipe(
          tap(this.onWalletDelete.bind(this)),
          mergeMap((authorized: boolean) => [
            new UpdateAppAction({ authorized }),
            new DeleteWalletCompletedAction(wallet.id),
          ]),
        ),
    ),
  );

  @Effect()
  ignoreInviteRequest$: Observable<any> = this.actions$.pipe(
    ofType(WalletsActionType.IgnoreInviteRequest),
    switchMap((action: IgnoreInviteRequestAction) =>
      fromPromise(
        this.persistenceService.hideUnlockRequestAddress(action.address)
          .then(() => action.address),
      ),
    ),
    withLatestFrom(this.store.select(selectInviteRequests)),
    map(([address, inviteRequests]) =>
      new UpdateInviteRequestsAction(inviteRequests.filter(req => req.address !== address)),
    ),
  );


  @Effect()
  updateUtxos$: Observable<UpdateWalletsAction> = this.actions$.pipe(
    ofType(TransactionActionType.Update),
    withLatestFrom(this.store.select(selectWallets)),
    filter(([action, wallets]) => wallets && wallets.length > 0),
    map(([action, wallets]) => {
      // wallets.forEach((wallet: DisplayWallet) => wallet.updateUtxos((action as UpdateTransactionsAction).utxosByWallet[wallet.id]));

      return new UpdateWalletsAction(wallets);
    }),
  );

  @Effect()
  init$: Observable<InitWalletsAction> = defer(() =>
    fromPromise(this.updateAllWallets())
      .map(
        (wallets: DisplayWallet[]) => new InitWalletsAction(wallets),
      ),
  );

  constructor(
    protected actions$: Actions,
    protected walletService: WalletService,
    protected addressService: AddressService,
    protected profileService: ProfileService,
    protected txFormatService: TxFormatService,
    protected store: Store<IRootAppState>,
    protected persistenceService: PersistenceService,
    protected persistenceService2: PersistenceService2,
    protected storage: Storage,
    protected inviteRequestsService: InviteRequestsService,
    @Optional() private router?: Router,
  ) {
  }

  protected async onWalletDelete(authorized: boolean) {
    if (!authorized) {
      await this.storage.clear();
      this.router.navigateByUrl('/onboarding');
    } else {
      this.router.navigateByUrl('/wallets');
    }
  }

  private async updateAllWallets(): Promise<DisplayWallet[]> {
    const wallets = await this.profileService.getWallets();
    return Promise.all<DisplayWallet>(
      wallets.map(async w => {
        const displayWallet = await createDisplayWallet(w, this.walletService, this.inviteRequestsService, this.txFormatService, this.persistenceService2);
        displayWallet.importPreferences(await this.persistenceService2.getWalletPreferences(displayWallet.id));
        await this.updateVisitedInviteRequests(displayWallet.inviteRequests);
        return displayWallet;
      }),
    );
  }

  private async updateVisitedInviteRequests(inviteRequests: InviteRequest[]) {
    inviteRequests = inviteRequests || [];
    const visitedInvites = await this.persistenceService2.getVisitedInvites() || [];
    let updateVisitedInvites;

    inviteRequests.forEach(request => {
      const visited = visitedInvites.find(address => address === request.id);

      if (!visited) {
        // add new one in visited
        request.isNew = false;
        visitedInvites.push(request.id);
        updateVisitedInvites = true;
      }
    });

    if (updateVisitedInvites) {
      return this.persistenceService2.setVisitedInvites(visitedInvites);
    }
  }

  private calculateTotals(wallets: DisplayWallet[]): IWalletTotals {
    const totals: any = {
      totalGrowthRewards: 0,
      totalMiningRewards: 0,
      totalNetworkValue: 0,
      totalWalletsBalance: 0,
      invites: 0,
      communitySize: 0,
    };

    let allBalancesHidden = true;

    wallets.forEach(w => {
      totals.totalNetworkValue += w.totalNetworkValueMicro;
      totals.totalMiningRewards += w.miningRewardsMicro;
      totals.totalGrowthRewards += w.growthRewardsMicro;
      totals.invites += w.balance.spendableInvites;
      totals.communitySize += w.rankInfo.communitySize;

      if (!w.balanceHidden) {
        allBalancesHidden = false;
        totals.totalWalletsBalance += w.balance.amountMrt;
      }
    });

    return {
      totalNetworkValue: formatAmount(totals.totalNetworkValue, 'mrt'),
      totalMiningRewards: formatAmount(totals.totalMiningRewards, 'mrt'),
      totalGrowthRewards: formatAmount(totals.totalGrowthRewards, 'mrt'),
      totalWalletsBalance: formatAmount(totals.totalWalletsBalance, 'mrt'),
      totalWalletsBalanceFiat: this.txFormatService.formatAlternativeStr(totals.totalWalletsBalance),
      allBalancesHidden,
      invites: totals.invites,
      communitySize: totals.communitySize,
    };
  }

  private async calculateRankData(wallets: DisplayWallet[]): Promise<IRankData> {
    const hasConfirmedWallet = wallets.findIndex((wallet: DisplayWallet) => wallet.confirmed) !== -1;

    if (!hasConfirmedWallet) {
      return {
        unlocked: false,
        totalCGS: 0,
        bestRank: 0,
        bestPercentile: 0,
        percentileStr: '',
        rankChangeDay: 0,
        totalCommunitySize: 0,
        totalCommunitySizeChange: 0,
        totalProbability: 0,
        estimateStr: '',
      };
    }

    const ranks: IRankInfo[] = wallets.map(wallet => wallet.rankInfo);
    let topRank: IRankInfo = ranks[0];

    for (let i = 1; i < ranks.length; i++) {
      if (ranks[i].rank < topRank.rank) {
        topRank = ranks[i];
      }
    }

    const rankData: IRankData = {
      unlocked: true,
      totalCGS: 0,
      bestRank: topRank.rank,
      bestPercentile: +topRank.percentile,
      percentileStr: getPercentileStr(topRank),
      rankChangeDay: topRank.rankChangeDay,
      totalCommunitySize: 0,
      totalCommunitySizeChange: 0,
      totalProbability: 0,
      estimateStr: '',
    };

    ranks.forEach((rank: IRankInfo) => {
      rankData.totalCGS += rank.cgs;
      rankData.totalCommunitySize += rank.communitySize;
      rankData.totalCommunitySizeChange += rank.communitySizeChangeDay;
      rankData.totalProbability += rank.cgsPercent;
    });

    if (rankData.totalProbability === 0) {
      rankData.estimateStr = 'No rewards';
    } else {
      const estimateMinutesPerReward = 1 / (rankData.totalProbability * REWARDS_PER_BLOCK);

      if (estimateMinutesPerReward < 120) {
        rankData.estimateStr = `Every ${Math.ceil(estimateMinutesPerReward)}min`;
      } else if (estimateMinutesPerReward < 2880) {
        rankData.estimateStr = `Every ${ Math.ceil(estimateMinutesPerReward / 60)}hrs`;
      } else {
        rankData.estimateStr = `Every ${ Math.ceil(estimateMinutesPerReward / 1440)}days`;
      }
    }

    return rankData;
  }
}
