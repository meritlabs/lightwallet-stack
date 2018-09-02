import { Component, Input, ViewChild } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { ILeaderboard, IRankData, IRankInfo } from '@merit/common/models/rank';
import { GetStartedTipsComponent } from '@merit/desktop/app/core/components/profile-stats/get-started-tips/get-started-tips.component';
import { IWalletTotals, selectRankData } from '@merit/common/reducers/wallets.reducer';
import { Observable } from 'rxjs';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';

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
    if (val && val.length) {
      this.updateRankData();
    }
  }

  get wallets(): DisplayWallet[] {
    return this._wallets;
  }

  @ViewChild(GetStartedTipsComponent) getStarted: GetStartedTipsComponent;

  rankActive: boolean;
  leaderboard: ILeaderboard;

  rankData$: Observable<IRankData> = this.store.select(selectRankData);

  constructor(private store: Store<IRootAppState>) {
  }


  private async updateRankData() {
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

    await Promise.all(
      this.wallets.map(async wallet => {
        try {
          rankInfo.push(await wallet.client.getRankInfo())
        } catch (err) {
          console.log('Error occurred while getting rank info for wallet: ' + wallet.address);
          console.log(err);
        }
      })
    );

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
