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
    rank: number;
    alias?: string;
    address?: string;
    anv: number;
  }>;
  displayLeaderboard: Array<{
    rank: number;
    alias?: string;
    address?: string;
    anv: number;
  }>;

  ranks: Array<any>;
  ownOutranked: Array<any>;

  offset: number = 10;
  readonly LIMIT: number = 10;
  readonly LIST_LENGTH: number = 100;

  loading: boolean = true;

  constructor(private navCtrl: NavController, private navParams: NavParams, private profileService: ProfileService) {}

  async ionViewWillEnter() {
    this.wallets = await this.profileService.getConfimedWallets();
    await this.loadData();
    this.loading = false;
  }

  async doRefresh(refresher) {
    this.offset = 0;
    await this.loadData();

    refresher.complete();
  }

  async loadData() {
    await Promise.all([this.getLeaderboard(), this.getRankInfo()]);
    this.ownOutranked = this.ranks.filter(r => r.rank > this.LIST_LENGTH);
  }

  async getLeaderboard() {
    this.leaderboard = (await this.wallets[0].getCommunityLeaderboard(this.LIST_LENGTH)).ranks;
    this.displayLeaderboard = this.leaderboard.slice(0, this.offset + this.LIMIT);
  }

  async getRankInfo() {
    const ranks = [];
    await Promise.all(
      this.wallets.map(async w => {
        const rankInfo = (await w.getCommunityRank()).ranks[0];
        ranks.push(rankInfo);
      }),
    );
    this.ranks = ranks;
  }

  showMore(infiniter) {
    this.offset += this.LIMIT;
    this.displayLeaderboard = this.leaderboard.slice(0, this.offset + this.LIMIT);
    infiniter.complete();
  }

  isOwnWallet(r) {
    return !!this.ranks.some(w => w.address == r.address);
  }
}
