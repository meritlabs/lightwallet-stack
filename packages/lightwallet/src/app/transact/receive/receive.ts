import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, Events } from 'ionic-angular';

import { ProfileService } from "merit/core/profile.service";
import { WalletService } from "merit/wallets/wallet.service";
import { ToastConfig } from "merit/core/toast.config";
import { MeritToastController } from "merit/core/toast.controller";
import { Logger } from "merit/core/logger";
import { SocialSharing } from '@ionic-native/social-sharing';
import { Clipboard } from '@ionic-native/clipboard';
import { PlatformService } from 'merit/core/platform.service';

import { RateService } from 'merit/transact/rate.service';
import { ConfigService } from "merit/shared/config.service";
import { MeritWalletClient } from 'src/lib/merit-wallet-client';

import { Errors } from 'merit/../lib/merit-wallet-client/lib/errors';


@IonicPage()
@Component({
  selector: 'view-receive',
  templateUrl: 'receive.html',
})
export class ReceiveView {

  public protocolHandler: string;
  public address: string;
  public qrAddress:string;
  public amount:number;
  public amountMicros:number;
  public availableUnits:Array<string>;
  public amountCurrency:string;

  public wallets;
  public wallet;

  public addressGenerationInProgress:boolean;
  public socialSharingAvailable:boolean;

  public error:string;
  public mainAddressGapReached:boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl:ModalController,
    private profileService:ProfileService,
    private walletService:WalletService,
    private loadCtrl:LoadingController,
    private toastCtrl:MeritToastController,
    private logger:Logger,
    private socialSharing: SocialSharing,
    private clipboard:Clipboard,
    private rateService:RateService,
    private configService:ConfigService,
    private events: Events
  ) {
    this.protocolHandler = "merit";
    this.availableUnits = [
      this.configService.get().wallet.settings.unitCode.toUpperCase(),
      this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase()
    ];
    this.amountCurrency = this.availableUnits[0];
  }

  ionViewDidLoad() {
    this.profileService.getWallets().then((wallets: MeritWalletClient[]) => {
      this.wallets = wallets;
      if (this.wallets && this.wallets[0]) {
        this.wallet = this.wallets[0];
        this.generateAddress();
      }
    });


    // Get a new address if we just received an incoming TX (on an address we already have)
    this.events.subscribe('Remote:IncomingTx', (walletId, type, n) => {
      this.logger.info("Got an incomingTx on receive screen: ", n);
      if (this.wallet && this.wallet.id == walletId && n.data.address == this.address) {
        this.generateAddress(true);
      }
    })
  }

  generateAddress(forceNew?: boolean) {
    this.addressGenerationInProgress = true;
    this.error = null;

    return this.walletService.getAddress(this.wallet, forceNew).then((address) => {

      this.address = address.address;
      this.addressGenerationInProgress = false;
      if (forceNew) this.mainAddressGapReached = false; // that means, we  successfully generated NEW address
      this.formatAddress();
    }).catch((err) => {

      if (err.code == Errors.MAIN_ADDRESS_GAP_REACHED.code) {
        this.mainAddressGapReached = true;
        return this.generateAddress(false);
      } else {

        this.addressGenerationInProgress = false;

        if (err.text) this.error = err.text;

        this.toastCtrl.create({
          message: err.text || 'Failed to generate new adrress',
          cssClass: ToastConfig.CLASS_ERROR
        }).present();
      }

    });

  }

  selectWallet() {
    let modal = this.modalCtrl.create('SelectWalletModal', {selectedWallet: this.wallet, availableWallets: this.wallets});
    modal.present();
    modal.onDidDismiss((wallet) => {
      if (wallet) {
        this.wallet = wallet;
        this.generateAddress(false);
      }
    });
  }

  share() {
    this.socialSharing.share(this.qrAddress);
  }

  copyToClipboard(addressString: string) {
    if (!addressString) return;

    const address = addressString.split(':')[1] || addressString;

    this.clipboard.copy(address);

    this.toastCtrl.create({
      message: 'Address copied to clipboard',
      cssClass: ToastConfig.CLASS_MESSAGE
    }).present();
  }

  toCopayers() {
    this.navCtrl.push('CopayersView', {walletId: this.wallet.id, wallet: this.wallet});
  }

  toggleCurrency() {
    this.amountCurrency = this.amountCurrency == this.availableUnits[0] ? this.availableUnits[1] : this.availableUnits[0];
    this.changeAmount();
  }

  changeAmount() {

    if (this.amountCurrency.toUpperCase() == this.configService.get().wallet.settings.unitName.toUpperCase()) {
      this.amountMicros = this.rateService.mrtToMicro(this.amount);
    } else {
      this.amountMicros = this.rateService.fromFiatToMicros(this.amount, this.amountCurrency);
    }
    this.formatAddress();
  }

  private formatAddress() {
    this.qrAddress = `${this.protocolHandler}:${this.address}${this.amountMicros ? '?micros='+this.amountMicros : ''}`;
  }

}
