import { Component, Input, ViewChild } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { ILeaderboard, IRankData, IRankInfo } from '@merit/common/models/rank';
import { GetStartedTipsComponent } from '@merit/desktop/app/core/components/profile-stats/get-started-tips/get-started-tips.component';
import { IWalletTotals } from '@merit/common/reducers/wallets.reducer';

@Component({
  selector: 'profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.sass'],
})
export class ProfileStatsComponent {
  private _wallets: DisplayWallet[];

  @Input() totals: IWalletTotals;
  @Input() loading: boolean;

  @Input()
  set wallets(val: DisplayWallet[]) {
    this._wallets = val;
    this.updateRankData();
  }

  get wallets(): DisplayWallet[] {
    return this._wallets;
  }

  @ViewChild(GetStartedTipsComponent) getStarted: GetStartedTipsComponent;

  rankActive: boolean;
  ranks: IRankInfo[];
  leaderboard: ILeaderboard;

  rankData: IRankData;

  private async updateRankData() {
    const hasConfirmedWallet = this.wallets.findIndex((wallet: DisplayWallet) => wallet.confirmed) !== -1;

    if (!hasConfirmedWallet) {
      this.rankData = {
        unlocked: false,
        totalAnv: 0,
        bestRank: 0,
        bestPercentile: 0,
        percentileStr: '',
        rankChangeDay: 0,
        totalCommunitySize: 0,
        totalCommunitySizeChange: 0,
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

    const rankData: IRankData = {
      unlocked: true,
      totalAnv: 0,
      bestRank: topRank.rank,
      bestPercentile: +topRank.percentile,
      percentileStr: this.getPercentileStr(topRank),
      rankChangeDay: topRank.rankChangeDay,
      totalCommunitySize: 0,
      totalCommunitySizeChange: 0,
    };

    ranks.forEach((rank: IRankInfo) => {
      rankData.totalAnv += rank.anv;
      rankData.totalCommunitySize += rank.communitySize;
      rankData.totalCommunitySizeChange += rank.communitySizeChangeDay;
    });

    this.rankData = rankData;
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

  private async getRankInfo(): Promise<IRankInfo[]> {
    const rankInfo: IRankInfo[] = [];

    for (let i = 0; i < this.wallets.length; i++) {
      try {
        rankInfo.push(await this.wallets[i].client.getRankInfo())
      } catch (err) {
        console.log('Error occurred while getting rank info for wallet: ' + this.wallets[i].client.rootAddress.toString());
        console.log(err);
      }
    }

    return rankInfo;
  }

  onButtonClick(type?: 'rank' | 'community' | 'growth' | 'mining') {
    switch (type) {
      case 'rank':
        this.rankActive = true;
        this.getStarted.hide();
        break;

      case 'community':
      case 'growth':
      case 'mining':
        this.rankActive = false;
        this.getStarted.setType(type);
        break;

      default:
        this.rankActive = false;
    }
  }
}
