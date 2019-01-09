import { Component, Input } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { DisplayWallet } from '@merit/common/models/display-wallet';

// TODO move this interface to a model file
interface IRankData {
  unlocked: boolean;
  totalAnv: number;
  bestRank: number;
  bestPercentile: number;
  percentileStr: string;
}

// TODO move this interface to a model file
interface IRankInfo {
  address: string;
  alias?: string;
  anv: number;
  anvpercent: number;
  percentile: string;
  rank: number;
}

@Component({
  selector: 'profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.sass'],
})
export class ProfileStatsComponent {
  private _wallets: DisplayWallet[];

  @Input()
  totals: any;
  @Input()
  loading: boolean;

  @Input()
  set wallets(val: DisplayWallet[]) {
    this._wallets = val;
    this.updateRankData();
  }

  get wallets(): DisplayWallet[] {
    return this._wallets;
  }

  rankActive: boolean;
  ranks: any;
  leaderboard: any;
  displayLeaderboard: any;
  offset: number = 0;
  LIMIT: number = 100;

  rankData: IRankData = {
    unlocked: false,
    totalAnv: 0,
    bestRank: 0,
    bestPercentile: 0,
    percentileStr: '',
  };

  private async updateRankData() {
    const hasConfirmedWallet = this.wallets.findIndex((wallet: DisplayWallet) => wallet.confirmed) !== -1;

    if (!hasConfirmedWallet) {
      this.rankData = {
        unlocked: false,
        totalAnv: 0,
        bestRank: 0,
        bestPercentile: 0,
        percentileStr: '',
      };
      return;
    }

    const rankInfo: any = await this.getRankInfo();
    const ranks: IRankInfo[] = rankInfo.ranks;
    let topRank: IRankInfo;

    ranks.forEach((rank: IRankInfo) => {
      if (!topRank || rank.rank < topRank.rank) {
        topRank = rank;
      }
    });

    const topRankWallet: DisplayWallet = this.wallets.find(
      (wallet: DisplayWallet) => wallet.referrerAddress === topRank.address,
    );

    this.rankData = {
      unlocked: true,
      totalAnv: ranks.reduce((total: number, rank: IRankInfo) => total + rank.anv, 0),
      bestRank: topRank.rank,
      bestPercentile: +topRank.percentile,
      percentileStr: this.getPercentileStr(topRank),
    };
    this.ranks = ranks;
    this.leaderboard = (await topRankWallet.client.getCommunityLeaderboard(this.LIMIT)).ranks;
    this.displayLeaderboard = this.leaderboard.slice(this.offset, this.LIMIT);
  }

  // TODO: move this function to a utils file
  private getPercentileStr(rankData: IRankInfo) {
    const percentile = Number(rankData.percentile);

    return percentile > 20
      ? 'Top ' + Math.max(Math.round(100 - percentile), 1) + '%'
      : 'Bottom ' + Math.max(Math.round(percentile), 1) + '%';
  }

  private getRankInfo(): Promise<any> {
    const addresses = this.wallets
      .filter((wallet: DisplayWallet) => wallet.confirmed)
      .map((wallet: DisplayWallet) => wallet.client.getRootAddress().toString());

    return this.wallets[0].client.getCommunityRanks(addresses);
  }

  onRankClose() {
    this.rankActive = false;
  }

  onMoreSecurityRewards() {
    document.getElementById('startMiningBtn').click();
  }

  onMoreCommunity() {
    document.getElementById('extendCommunityBtn').click();
  }
}
