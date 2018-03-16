import { Component } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicPage } from 'ionic-angular';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { createDisplayWallet, DisplayWallet } from '@merit/common/models/display-wallet';
import { ProfileService } from '@merit/common/services/profile.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { UnlockRequestService } from '@merit/common/services/unlock-request.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { FiatAmount } from '@merit/common/models/fiat-amount';
import { MWCErrors } from '@merit/common/merit-wallet-client/lib/errors';
import { MeritToastController, ToastConfig } from '@merit/common/services/toast.controller.service';
import { AddressService } from '@merit/common/services/address.service';

@IonicPage()
@Component({
  selector: 'view-network',
  templateUrl: 'network.html',
})
export class NetworkView {
  static readonly RETRY_MAX_ATTEMPTS = 5;
  static readonly RETRY_TIMEOUT = 1000;
  displayWallets: Array<DisplayWallet> = [];
  loading: boolean;

  totalNetworkValue: string;
  totalMiningRewards: string;
  totalAmbassadorRewards: string;

  activeUnlockRequests: number;
  activeInvites: number;

  constructor(private profileService: ProfileService,
              private clipboard: Clipboard,
              private toastCtrl: MeritToastController,
              private socialSharing: SocialSharing,
              private walletService: WalletService,
              private txFormatService: TxFormatService,
              private logger: LoggerService,
              private platformService: PlatformService,
              private unlockRequestService: UnlockRequestService,
              private addressService: AddressService) {
  }

  // Ensure that the wallets are loaded into the view on first load.
  async ngOnInit() {
    this.loading = true;
    try {
      const wallets: MeritWalletClient[] = await this.profileService.getWallets();
      this.displayWallets = await Promise.all(wallets.map((wallet: MeritWalletClient) => createDisplayWallet(wallet, this.walletService, this.addressService, this.txFormatService)));
      this.logger.info('DisplayWallets after ngOnInit: ', this.displayWallets);
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
  async ionViewWillEnter() {
    await this.updateView();
  }

  async doRefresh(refresher) {
    try {
      await this.updateView();
    } catch (err) {
    }

    refresher.complete();
  }

  async updateView() {
    try {
      this.activeUnlockRequests = this.unlockRequestService.activeRequestsNumber;
      await this.formatWallets(await this.loadInfo());
      await this.unlockRequestService.loadRequestsData();
      this.activeUnlockRequests = this.unlockRequestService.activeRequestsNumber; 
    } catch (err) {
      this.logger.warn(err);
      this.toastCtrl
        .create({
          message: err.text || 'Unknown error',
          cssClass: ToastConfig.CLASS_ERROR,
        })
        .present();
    }
  }

  async copyToClipboard(code) {
    await this.platformService.ready();

    if (Clipboard.installed())
      await this.clipboard.copy(code);

    this.toastCtrl.create({
      message: 'Copied to clipboard',
      cssClass: ToastConfig.CLASS_MESSAGE
    }).present();
  }

  shareButtonAvailable() {
    return this.platformService.isCordova;
  }

  shareAddress(address) {
    return this.socialSharing.share(address);
  }

  private async loadWallets() {

    const displayWallets: DisplayWallet[] = [];
    for (let wallet of await this.profileService.getWallets()) {
      displayWallets.push(await createDisplayWallet(wallet, this.walletService, this.addressService, this.txFormatService));
    }

    this.activeInvites = 0;
    for (let dWallet of displayWallets) {
      this.activeInvites += dWallet.invites;
    }

    return displayWallets; 
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
            if (err.code == MWCErrors.CONNECTION_ERROR.code || err.code == MWCErrors.SERVER_UNAVAILABLE.code) {
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
