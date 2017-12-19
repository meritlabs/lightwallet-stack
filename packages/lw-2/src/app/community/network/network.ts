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
import { FiatAmount } from 'merit/shared/fiat-amount.model';

import { Errors } from 'merit/../lib/merit-wallet-client/lib/errors';


interface DisplayWallet {
  name: string,
  locked: boolean,
  color: string,
  shareCode: string,
  totalNetworkValueMicro: number,
  totalNetworkValueMerit: string,
  totalNetworkValueFiat: string,
  miningRewardsMicro: number,
  miningRewardsMerit: string,
  miningRewardsFiat: string,
  ambassadorRewardsMicro: number
  ambassadorRewardsMerit: string
  ambassadorRewardsFiat: string
}

// Network View 
// Part of the Community Tab.
@IonicPage()
@Component({
  selector: 'view-network',
  templateUrl: 'network.html',
})
export class NetworkView {
  public displayWallets: Array<DisplayWallet> = [];

  public loading:boolean;

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

  // Ensure that the wallets are loaded into the view on first load.
  ionViewDidLoad() {
    this.loading = true;
    this.profileService.getWallets().then((wallets: MeritWalletClient[]) => {
      let newDisplayWallets: DisplayWallet[] = [];
      _.each(wallets, (wallet: MeritWalletClient) => {
        // The wallet client will already have the below information.
        let filteredWallet = _.pick(wallet, "id", "wallet", "name", "locked", "color", "shareCode");
        this.logger.info("FilteredWallet: ", filteredWallet);
        newDisplayWallets.push(<DisplayWallet>filteredWallet);
      });
      this.displayWallets = newDisplayWallets;
      this.logger.info("DisplayWallets after ionViewLoad: ", this.displayWallets);
      this.loading = false;
    }).catch((err) => {

      this.loading = false;
      this.toastCtrl.create({
        message: err.text || 'Unknown error',
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    });
  }

  // On each enter, let's update the network data.  
  ionViewDidEnter() {
    this.updateInfo().catch((err) => {
      console.log('failed to receive network data');
    })
  }

  doRefresh(refresher) {
    if (!this.loading) {
      this.updateInfo().then(() => {
        refresher.complete();
      }).catch((err) => {
        refresher.complete();
      })
    }
  }

  private formatNetworkInfo(wallets: DisplayWallet[]): Promise<Array<DisplayWallet>> {
    let formatPromises: Array<Promise<any>> = [];
    let newDWallets: Array<DisplayWallet> = [];
    return Promise.each(wallets, (dWallet: DisplayWallet) => {
      if (!_.isNil(dWallet.totalNetworkValueMicro)) {
        dWallet.totalNetworkValueMerit = this.txFormatService.parseAmount(dWallet.totalNetworkValueMicro, 'micros').amountUnitStr;
        formatPromises.push(this.txFormatService.formatToUSD(dWallet.totalNetworkValueMicro).then((usdAmount) => {
          dWallet.totalNetworkValueFiat = new FiatAmount(+usdAmount).amountStr;
          return Promise.resolve();
        }));
      }

      if (!_.isNil(dWallet.miningRewardsMicro)) {
        dWallet.miningRewardsMerit = this.txFormatService.parseAmount(dWallet.miningRewardsMicro, 'micros').amountUnitStr;
        formatPromises.push(this.txFormatService.formatToUSD(dWallet.miningRewardsMicro).then((usdAmount) => {
          dWallet.miningRewardsFiat = new FiatAmount(+usdAmount).amountStr;
          return Promise.resolve();
        }));
      }

      if (!_.isNil(dWallet.ambassadorRewardsMicro)) {
        dWallet.ambassadorRewardsMerit = this.txFormatService.parseAmount(dWallet.ambassadorRewardsMicro, 'micros').amountUnitStr;
        formatPromises.push(this.txFormatService.formatToUSD(dWallet.ambassadorRewardsMicro).then((usdAmount) => {
          dWallet.ambassadorRewardsFiat = new FiatAmount(+usdAmount).amountStr;
          return Promise.resolve();
        }));
      }
      return Promise.all(formatPromises).then(() => {
        newDWallets.push(dWallet)
      });
    }).then(() => {
      return Promise.resolve(newDWallets);
    })
  }

  private updateInfo() {
    this.loading = true;
    const MAX_ATTEMPTS = 5;
    let attempt = 0;

    return new Promise((resolve, reject) => {

      let update = () => {
        return this.profileService.getWallets().then((wallets: MeritWalletClient[]) => {

          return Promise.map(wallets, (wallet: MeritWalletClient) => {
            let filteredWallet = <DisplayWallet>_.pick(wallet, "id", "wallet", "name", "locked", "color", "shareCode", "totalNetworkValue");

            return this.walletService.getANV(wallet).then((anv) => {
              filteredWallet.totalNetworkValueMicro = anv;
            }).then(() => {
              return this.walletService.getRewards(wallet).then((data) => {
                // If we cannot properly fetch data, let's return wallets as-is.
                if (data && !_.isNil(data.mining)) {
                  filteredWallet.miningRewardsMicro = data.mining;
                }
                if (data && !_.isNil(data.mining)) {

                  filteredWallet.ambassadorRewardsMicro = data.ambassador;
                }
                return filteredWallet;
              });
            })
          }).then((processedWallets: DisplayWallet[]) => {
            return this.formatNetworkInfo(processedWallets).then((readyForDisplay: DisplayWallet[]) => {
              this.zone.run(() => {
                this.displayWallets = readyForDisplay;
                this.loading = false;
                return resolve();
              });
            });
          });
        }).catch((err) => {

          if (err.code == Errors.CONNECTION_ERROR.code) {
            if (++attempt < MAX_ATTEMPTS) {
              return setTimeout(update, 1000);
            }
          }

          this.loading = false;

          this.toastCtrl.create({
            message: err.text || 'Unknown error',
            cssClass: ToastConfig.CLASS_ERROR
          }).present();

          return reject();
        });
      };

      update();

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
