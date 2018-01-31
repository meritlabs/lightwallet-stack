import { Component } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicPage } from 'ionic-angular';
import * as _ from 'lodash';
import { Errors } from 'merit/../lib/merit-wallet-client/lib/errors';
import { BwcService } from 'merit/core/bwc.service';
import { Logger } from 'merit/core/logger';
import { PlatformService } from 'merit/core/platform.service';
import { ProfileService } from 'merit/core/profile.service';
import { ToastConfig } from 'merit/core/toast.config';
import { MeritToastController } from 'merit/core/toast.controller';
import { FiatAmount } from 'merit/shared/fiat-amount.model';
import { TxFormatService } from 'merit/transact/tx-format.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { Observable } from 'rxjs/Observable';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';

interface DisplayWallet {
  name: string;
  locked: boolean;
  color: string;
  referrerAddress: string;
  totalNetworkValueMicro: number;
  totalNetworkValueMerit: string;
  totalNetworkValueFiat: string;
  miningRewardsMicro: number;
  miningRewardsMerit: string;
  miningRewardsFiat: string;
  ambassadorRewardsMicro: number;
  ambassadorRewardsMerit: string;
  ambassadorRewardsFiat: string;
  network: string;
  credentials: any;
  inviteRequests:Array<any>;
}

// Network View
// Part of the Community Tab.
@IonicPage()
@Component({
  selector: 'view-network',
  templateUrl: 'network.html',
})

export class NetworkView {
  static readonly RETRY_MAX_ATTEMPTS = 5;
  static readonly RETRY_TIMEOUT = 1000;
  public displayWallets: Array<DisplayWallet> = [];
  public loading: boolean;

  totalNetworkValue: string;
  totalMiningRewards: string;
  totalAmbassadorRewards: string;

  constructor(private profileService: ProfileService,
              private clipboard: Clipboard,
              private toastCtrl: MeritToastController,
              private socialSharing: SocialSharing,
              private walletService: WalletService,
              private txFormatService: TxFormatService,
              private logger: Logger,
              private platformService: PlatformService,
              private bwcService: BwcService) {
  }

  // Ensure that the wallets are loaded into the view on first load.
  async ionViewDidLoad() {
    this.loading = true;
    try {
      const wallets: MeritWalletClient[] = await this.profileService.getWallets();
      let newDisplayWallets: DisplayWallet[] = [];
      _.each(wallets, (wallet: MeritWalletClient) => {
        // The wallet client will already have the below information.
        let filteredWallet = _.pick(wallet, 'id', 'wallet', 'name', 'locked', 'color', 'referrerAddress');
        this.logger.info('FilteredWallet: ', filteredWallet);
        newDisplayWallets.push(<DisplayWallet>filteredWallet);
      });
      this.displayWallets = newDisplayWallets;
      this.logger.info('DisplayWallets after ionViewLoad: ', this.displayWallets);
    } catch (err) {
      this.logger.warn(err);
      this.toastCtrl.create({
        message: err.text || 'Unknown error',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }
    this.loading = false;
  }

  // On each enter, let's update the network data.
  async ionViewDidEnter() {
    await this.updateView();
  }

  async doRefresh(refresher) {
    try {
      await this.updateView()
    } catch (err) {
    }

    refresher.complete();
  }

  async updateView() {
    if (this.loading === true) return;

    this.loading = true;

    try {
      await this.formatWallets(await this.loadInfo());
    } catch (err) {
      this.logger.warn(err);
      this.toastCtrl
        .create({
          message: err.text || 'Unknown error',
          cssClass: ToastConfig.CLASS_ERROR,
        })
        .present();
    }

    this.loading = false;
  }

  async copyToClipboard(code) {
    await this.platformService.ready();

    if (Clipboard.installed()) {
      await this.clipboard.copy(code);
    }

    console.log(code);

    this.toastCtrl.create({
      message: 'Copied to clipboard',
      cssClass: ToastConfig.CLASS_MESSAGE
    }).present();
  }

  shareButtonAvailable() {
    return this.platformService.isCordova;
  }

  shareCode(code) {
    return this.socialSharing.share('My invite code to use Merit: ' + code);
  }

  shareAddress(address) {
    return this.socialSharing.share('merit' + address);
  }

  private async loadWallets() {
    const wallets: MeritWalletClient[] = await this.profileService.getWallets();

    return Promise.all(wallets.map(async (wallet: MeritWalletClient) => {
      const filteredWallet: DisplayWallet = <DisplayWallet>_.pick(wallet, 'id', 'wallet', 'name', 'locked', 'color', 'totalNetworkValue', 'credentials', 'network');

      filteredWallet.referrerAddress = this.walletService.getRootAddress(wallet); 

      filteredWallet.totalNetworkValueMicro = await this.walletService.getANV(wallet);
      filteredWallet.inviteRequests = await this.walletService.getUnlockRequests(wallet);

      const data = await this.walletService.getRewards(wallet);

      // If we cannot properly fetch data, let's return wallets as-is.
      if (data && !_.isNil(data.mining)) {
        filteredWallet.miningRewardsMicro = data.mining;
        filteredWallet.ambassadorRewardsMicro = data.ambassador;
      }
      return filteredWallet;
    }));
  }

  private async formatWallets(processedWallets: DisplayWallet[]) {
    this.displayWallets = await this.formatNetworkInfo(processedWallets);
    let totalNetworkValue = 0, totalMiningRewards = 0, totalAmbassadorRewards = 0;

    this.displayWallets.forEach(w => {
      totalNetworkValue += w.totalNetworkValueMicro;
      totalMiningRewards += w.miningRewardsMicro;
      totalAmbassadorRewards += w.ambassadorRewardsMicro;
    });

    this.totalNetworkValue = this.txFormatService.parseAmount(totalNetworkValue, 'micros').amountUnitStr;
    this.totalMiningRewards = this.txFormatService.parseAmount(totalMiningRewards, 'micros').amountUnitStr;
    this.totalAmbassadorRewards = this.txFormatService.parseAmount(totalAmbassadorRewards, 'micros').amountUnitStr;
  }

  private loadInfo() {
    return Observable.defer(() => this.loadWallets())
      .retryWhen(err =>
        err
          .zip(Observable.range(1, NetworkView.RETRY_MAX_ATTEMPTS))
          .mergeMap(([err, attempt]) => {
            if (err.code == Errors.CONNECTION_ERROR.code || err.code == Errors.SERVER_UNAVAILABLE.code) {
              if (attempt < NetworkView.RETRY_MAX_ATTEMPTS) {
                return Observable.timer(NetworkView.RETRY_TIMEOUT);
              }
            }
            return Observable.throw(err);
          })
      )
      .toPromise();
  }

  private async formatNetworkInfo(wallets: DisplayWallet[]): Promise<DisplayWallet[]> {
    const newDWallets: Array<DisplayWallet> = [];

    for (let dWallet of wallets) {
      if (!_.isNil(dWallet.totalNetworkValueMicro)) {
        dWallet.totalNetworkValueMerit = this.txFormatService.parseAmount(dWallet.totalNetworkValueMicro, 'micros').amountUnitStr;
        dWallet.totalNetworkValueFiat = new FiatAmount(+await this.txFormatService.formatToUSD(dWallet.totalNetworkValueMicro)).amountStr;
      }

      if (!_.isNil(dWallet.miningRewardsMicro)) {
        dWallet.miningRewardsMerit = this.txFormatService.parseAmount(dWallet.miningRewardsMicro, 'micros').amountUnitStr;
        dWallet.miningRewardsFiat = new FiatAmount(+await this.txFormatService.formatToUSD(dWallet.miningRewardsMicro)).amountStr;
      }

      if (!_.isNil(dWallet.ambassadorRewardsMicro)) {
        dWallet.ambassadorRewardsMerit = this.txFormatService.parseAmount(dWallet.ambassadorRewardsMicro, 'micros').amountUnitStr;
        dWallet.ambassadorRewardsFiat = new FiatAmount(+await this.txFormatService.formatToUSD(dWallet.ambassadorRewardsMicro)).amountStr;
      }

      newDWallets.push(dWallet);
    }

    return newDWallets;
  }


}
