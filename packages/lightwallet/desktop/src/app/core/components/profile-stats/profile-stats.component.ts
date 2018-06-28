import { OnInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProfileService } from '@merit/common/services/profile.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { log } from 'util';

@Component({
  selector: 'profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileStatsComponent {
  @Input() totals: any;
  @Input() loading: boolean;
  @Input() wallets;

  _wallets: Array<MeritWalletClient>;

  ranks: any;
  leaderboard: any;
  displayLeaderboard: any;
  offset: number = 0;
  LIMIT: number = 10;
  constructor(private profileService: ProfileService) {}

  async ngOnInit() {
    this._wallets = await this.profileService.getWallets();
    await Promise.all([this.getLeaderboard(), this.getRankInfo()]);
    this.loading = false;
  }
  async getLeaderboard() {
    this.leaderboard = (await this._wallets[0].getCommunityLeaderboard(100)).ranks;
    this.displayLeaderboard = this.leaderboard.slice(this.offset, this.LIMIT);
    console.log(this.leaderboard);
  }

  async getRankInfo() {
    let ranks = [];
    this._wallets.map(async w => {
      console.log(w);

      let rankInfo = (await w.getCommunityRank()).ranks[0];
      console.log('!!!');

      console.log(rankInfo);

      rankInfo.walletName = w.rootAlias ? '@' + w.rootAlias : w.name;
      ranks.push(rankInfo);
    });
    this.ranks = ranks;
  }
}
