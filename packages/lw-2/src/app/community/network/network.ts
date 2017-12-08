import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileService } from "merit/core/profile.service";
import { ModalController } from "ionic-angular/index";

import { ToastConfig } from "merit/core/toast.config";
import { Clipboard } from '@ionic-native/clipboard';
import { MeritToastController } from "merit/core/toast.controller";
import { SocialSharing } from '@ionic-native/social-sharing';
import { WalletService } from "merit/wallets/wallet.service";
import { TxFormatService } from "merit/transact/tx-format.service";
import * as Promise from 'bluebird';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { Logger } from 'merit/core/logger';
import { NgZone } from '@angular/core';
import * as _ from "lodash";



// Network View 
// Part of the Community Tab.
@IonicPage()
@Component({
  selector: 'view-network',
  templateUrl: 'network.html',
})
export class NetworkView {

  public wallets: MeritWalletClient[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private profileService: ProfileService,
    private clipboard: Clipboard,
    private toastCtrl: MeritToastController,
    private socialSharing: SocialSharing,
    private walletService: WalletService,
    private txFormatService: TxFormatService,
    private logger: Logger,
    private zone: NgZone
  ) {
  }

  ionViewDidEnter() {
    this.updateInfo();
  }

  doRefresh(refresher) {
    this.updateInfo().then(() => {
      refresher.complete();
    }).catch((err) => {
      refresher.complete();
    })
  }

  private updateInfo() {
    return this.profileService.getWallets().then((wallets: MeritWalletClient[]) => {

      return Promise.map(wallets, (wallet: MeritWalletClient) => {
        return this.walletService.getANV(wallet).then((anv) => {
          return wallet.totalNetworkValue = this.txFormatService.parseAmount(anv, 'MRT').amountUnitStr;
        }).then(() => {
          return this.walletService.getRewards(wallet).then((data) => {
            this.logger.warn("Got Rewards in network view with: ", data);
            // If we cannot properly fetch data, let's return wallets as-is.
            if (data && !_.isNil(data.mining)) {
              wallet.miningRewards = this.txFormatService.parseAmount(data.mining, 'MRT').amountUnitStr;
            }
            if (data && !_.isNil(data.mining)) {

              wallet.ambassadorRewards = this.txFormatService.parseAmount(data.ambassador, 'MRT').amountUnitStr;
            }
            return wallet;
          });
        });
      }).then((processedWallets: MeritWalletClient[]) => {
        this.logger.info("What are the processed wallets?: ", processedWallets);
        // We must explicitly run this in the angular zone because it's a change on
        // the MWC class.
        this.zone.run(() => {
          this.wallets = processedWallets;
        });
      });
    }).catch((err) => {
      this.toastCtrl.create({
        message: err,
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    });
  }


  copyToClipboard(code) {
    this.clipboard.copy(code);

    this.toastCtrl.create({
      message: 'Copied to clipboard',
      cssClass: ToastConfig.CLASS_MESSAGE
    }).present();
  }

  shareCode(code) {
    this.socialSharing.share('My invite code to use Merit: ' + code);
  }

  shareAddress(address) {
    this.socialSharing.share('merit' + address);
  }


}
