import { Component } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicPage, Events } from 'ionic-angular';
import { ProfileService } from '@merit/common/services/profile.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { UnlockRequestService } from '@merit/common/services/unlock-request.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';

@IonicPage()
@Component({
  selector: 'view-network',
  templateUrl: 'network.html',
})
export class NetworkView {
  loading: boolean;
  refreshing: boolean;

  wallets: MeritWalletClient[];

  network: {
    communitySize: number;
    miningRewards: number;
    growthRewards: number;
    wallets: Array<{
      name: string;
      referralAddress: string;
      alias: string;
      confirmed: boolean;
      communitySize: number;
      miningRewards: number;
      growthRewards: number;
      color: string;
    }>;
  } = {
    communitySize: 0,
    miningRewards: 0,
    growthRewards: 0,
    wallets: [],
  };

  rankData: {
    totalAnv: number;
    totalProbability: number;
    bestRank: number;
    bestPercentile: number;
    percentileStr: string;
    estimateStr: string;
  } = {
    totalAnv: 0,
    totalProbability: 0,
    bestRank: 0,
    bestPercentile: 0,
    percentileStr: '',
    estimateStr: '',
  };

  activeUnlockRequests: number;
  availableInvites: number;
  pendingInvites: number;
  shareButtonAvailable: boolean;

  REWARDS_PER_BLOCK: number = 5;

  constructor(
    private toastCtrl: ToastControllerService,
    private socialSharing: SocialSharing,
    private profileService: ProfileService,
    private unlockRequestService: UnlockRequestService,
    private logger: LoggerService,
    private events: Events,
    platformService: PlatformService,
  ) {
    this.shareButtonAvailable = platformService.isCordova;
  }

  async ionViewDidLoad() {
    this.loading = true;
    this.activeUnlockRequests = this.unlockRequestService.activeRequestsNumber;
    await Promise.all([this.loadRankingInfo(), this.loadCommunityInfo()]);
    this.loading = false;

    this.events.subscribe('Remote:IncomingTx', () => {
      this.refreshData();
    });
  }

  async ionViewWillEnter() {
    if (!this.loading) {
      await this.refreshData();
    }
  }

  async doRefresh(refresher) {
    await this.refreshData();
    refresher.complete();
  }

  private async refreshData() {
    this.refreshing = true;
    const refreshCommunity = async () => {
      this.network = await this.profileService.refreshCommunityInfo();
    };
    await Promise.all([refreshCommunity(), this.loadRankingInfo(), this.loadRequestsInfo()]);

    this.availableInvites = this.wallets.reduce((number, w) => {
      return number + w.availableInvites;
    }, 0);

    this.pendingInvites = this.wallets.reduce((number, w) => {
      return number + w.pendingInvites;
    }, 0);
    this.refreshing = false;
  }

  shareAddress(address) {
    return this.socialSharing.share(address);
  }

  notifyCopy() {
    this.toastCtrl.success('Copied to clipboard');
  }

  private async loadRankingInfo() {
    this.wallets = await this.profileService.getWallets();

    let rankData = {
      totalAnv: 0,
      totalProbability: 0,
      bestRank: 0,
      bestPercentile: 0,
      percentileStr: '',
      estimateStr: '',
    };
    const addresses = this.wallets.filter(w => w.confirmed).map(w => w.getRootAddress().toString());
    if (addresses.length) {
      let ranks = (await this.wallets[0].getCommunityRanks(addresses)).ranks;
      ranks.forEach(walletRank => {
        rankData.totalAnv += walletRank.anv;
        rankData.totalProbability += walletRank.anvpercent;
        if (!rankData.bestRank || rankData.bestRank > walletRank.rank) rankData.bestRank = walletRank.rank;
        if (!rankData.bestPercentile || rankData.bestPercentile < walletRank.percentile)
          rankData.bestPercentile = walletRank.percentile;
      });

      rankData.percentileStr =
        rankData.bestPercentile > 20
          ? 'top ' + Math.max(Math.round(100 - rankData.bestPercentile), 1) + '%'
          : 'bottom ' + Math.max(Math.round(rankData.bestPercentile), 1) + '%';

      const estimateMinutesPerReward = 1 / (rankData.totalProbability * this.REWARDS_PER_BLOCK);

      if (estimateMinutesPerReward < 120) {
        rankData.estimateStr = `Every ${Math.ceil(estimateMinutesPerReward)}min`;
      } else if (estimateMinutesPerReward < 2880) {
        rankData.estimateStr = `Every ${Math.ceil(estimateMinutesPerReward / 60)}hrs`;
      } else {
        rankData.estimateStr = `Every ${Math.ceil(estimateMinutesPerReward / 1440)}days`;
      }
    }

    this.rankData = rankData;
  }

  private async loadCommunityInfo() {
    try {
      this.wallets = await this.profileService.getWallets();

      this.availableInvites = this.wallets.reduce((number, w) => {
        return number + w.availableInvites;
      }, 0);

      this.pendingInvites = this.wallets.reduce((number, w) => {
        return number + w.pendingInvites;
      }, 0);
      this.network = await this.profileService.getCommunityInfo();
    } catch (err) {
      this.logger.warn(err);
      this.toastCtrl.error(err.text || 'Unknown error');
    }
  }

  private async loadRequestsInfo() {
    try {
      await this.unlockRequestService.loadRequestsData();
      this.activeUnlockRequests = this.unlockRequestService.activeRequestsNumber;
    } catch (err) {
      this.logger.warn(err);
      this.toastCtrl.error(err.text || 'Unknown error');
    }
  }
}
