import { OnInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProfileService } from '@merit/common/services/profile.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { forEach } from 'lodash';

@Component({
  selector: 'profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileStatsComponent implements OnInit {
  @Input() totals: any;
  @Input() loading: boolean;
  @Input() wallets;

  _wallets: Array<MeritWalletClient>;

  rankActive: boolean;
  ranks: any;
  leaderboard: any;
  displayLeaderboard: any;
  offset: number = 0;
  LIMIT: number = 100;

  rankData: {
    totalAnv: number,
    bestRank: number,
    bestPercentile: number,
    percentileStr: string,
  } = {
    totalAnv: 0,
    bestRank: 0,
    bestPercentile: 0,
    percentileStr: '',
  };

  constructor(private profileService: ProfileService) {}

  async ngOnInit() {
    this._wallets = await this.profileService.getConfimedWallets();
    await Promise.all([this.getLeaderboard(), this.getRankInfo()]);
    this.loadRankingInfo();
    this.loading = false;
  }

  async getLeaderboard() {
    this.leaderboard = (await this._wallets[0].getCommunityLeaderboard(this.LIMIT)).ranks;
    this.displayLeaderboard = this.leaderboard.slice(this.offset, this.LIMIT);
    console.log('getLeaderboard');
  }

  async getRankInfo() {
    let ranks = [];
    this._wallets.map(async w => {
      const rankInfo = (await w.getCommunityRank()).ranks[0];
      rankInfo.walletName = w.rootAlias ? '@' + w.rootAlias : w.name;
      ranks.push(rankInfo);
    });
    this.ranks = ranks;
    console.log('getRankInfo');
  }

  onRankClose($event) {
    this.rankActive = $event;
  }

  private loadRankingInfo() {
    console.log('loadRankingInfo');
    const ranks = this.ranks;
    console.log(ranks);
    let rankData = {
      totalAnv: 0,
      bestRank: 0,
      bestPercentile: 0,
      percentileStr: '',
    };

    console.log(ranks.length);
    ranks.forEach(walletRank => {
      console.log(walletRank);
      rankData.totalAnv += walletRank.anv;
      if (!rankData.bestRank || rankData.bestRank > walletRank.rank) rankData.bestRank = walletRank.rank;
      if (!rankData.bestPercentile || rankData.bestPercentile < walletRank.percentile) rankData.bestPercentile = walletRank.percentile;
    });

    rankData.percentileStr = (rankData.bestPercentile > 20)
      ? 'Top ' + Math.max(Math.round(100 - rankData.bestPercentile), 1) + '%'
      : 'Bottom ' + Math.max(Math.round(rankData.bestPercentile), 1) + '%';

    this.rankData = rankData;
  }
}
