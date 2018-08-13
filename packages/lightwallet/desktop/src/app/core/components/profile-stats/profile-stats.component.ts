import { Component, Input } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { ILeaderboard, IRankData, IRankInfo } from '@merit/common/models/rank';

@Component({
  selector: 'profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.sass'],
})
export class ProfileStatsComponent {
  private _wallets: DisplayWallet[];

  @Input() totals: any;
  @Input() loading: boolean;

  @Input()
  set wallets(val: DisplayWallet[]) {
    this._wallets = val;
    this.updateRankData();
  }

  get wallets(): DisplayWallet[] {
    return this._wallets;
  }

  rankActive: boolean;
  ranks: IRankInfo[];
  leaderboard: ILeaderboard;

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

    const rankInfo = await this.getRankInfo();
    const ranks: IRankInfo[] = rankInfo;
    let topRank: IRankInfo = rankInfo[0];

    for (let i = 1; i < ranks.length; i++) {
      if (ranks[i].rank < topRank.rank) {
        topRank = ranks[i];
      }
    }

    this.rankData = {
      unlocked: true,
      totalAnv: ranks.reduce((total: number, rank: IRankInfo) => total + rank.anv, 0),
      bestRank: topRank.rank,
      bestPercentile: +topRank.percentile,
      percentileStr: this.getPercentileStr(topRank),
    };

    this.ranks = ranks;
    this.leaderboard = await this.wallets[0].client.getCommunityLeaderboard();
  }


  // TODO: move this function to a utils file
  private getPercentileStr(rankData: IRankInfo) {
    const percentile = Number(rankData.percentile);

    return (percentile > 20)
      ? 'Top ' + Math.max(Math.round(100 - percentile), 1) + '%'
      : 'Bottom ' + Math.max(Math.round(percentile), 1) + '%';
  }

  private getRankInfo(): Promise<IRankInfo[]> {
    return Promise.all(
      this.wallets.map(wallet => wallet.client.getRankInfo())
    );
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
