import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Tabs, ViewController, AlertController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ProfileService } from '@merit/common/services/profile.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';



@IonicPage()
@Component({
  selector: 'view-leaderboard',
  templateUrl: 'leaderboard.html',
})
export class LeaderboardView {

  wallets: Array<MeritWalletClient>;
  leaderboard: Array<{
    rank: number,
    alias?: string,
    address?: string,
    anv: number
  }>;
  displayLeaderboard: Array<{
    rank: number,
    alias?: string,
    address?: string,
    anv: number
  }>;

  ranks: Array<any>;
  ownOutranked: Array<any>;

  offset: number = 0;
  readonly LIMIT: number = 10;
  readonly LIST_LENGTH: number = 100;

  loading: boolean = true;



  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private profileService: ProfileService
  ) {
  }

  async ionViewWillEnter() {
    this.wallets = await this.profileService.getWallets();
    await Promise.all([this.getLeaderboard(), this.getRankInfo()]);
    this.loading = false;
  }

  async doRefresh(refresher) {
    this.offset = 0;
    await Promise.all([this.getLeaderboard(), this.getRankInfo()]);
    refresher.complete();
  }

  async getLeaderboard() {
    this.leaderboard = (await this.wallets[0].getCommunityLeaderboard(this.LIST_LENGTH)).ranks;

    this.displayLeaderboard = this.leaderboard.slice(0, this.offset + this.LIMIT);
    this.ownOutranked = this.ranks.filter(r => r.rank > this.LIMIT);
  }

  async getRankInfo() {
    let ranks = [];
    this.wallets.map(async (w) => {
      let rankInfo = (await w.getCommunityRank()).ranks[0];
      rankInfo.alias = w.rootAlias;
      rankInfo.address = w.rootAddress;
      ranks.push(rankInfo);
    });

    this.ranks = ranks;
  }

  showMore(infiniter) {
    this.offset += this.LIMIT;
    this.displayLeaderboard = this.leaderboard.slice(0, this.offset + this.LIMIT);
    this.ownOutranked = this.ranks.filter(r => r.rank > this.offset);
    infiniter.complete();
  }

  isOwnWallet(r) {
    return !!this.ranks.some(w => {
      if (w.alias) return w.alias == r.alias;
      if (w.address) return w.address == r.address;
    });
  }

}
