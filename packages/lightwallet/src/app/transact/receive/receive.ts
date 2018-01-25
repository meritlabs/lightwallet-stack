import { Component } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Events, IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';

import { Errors } from 'merit/../lib/merit-wallet-client/lib/errors';
import { Logger } from 'merit/core/logger';

import { ProfileService } from 'merit/core/profile.service';
import { ToastConfig } from 'merit/core/toast.config';
import { MeritToastController } from 'merit/core/toast.controller';
import { ConfigService } from 'merit/shared/config.service';

import { RateService } from 'merit/transact/rate.service';
import { WalletService } from 'merit/wallets/wallet.service';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { MERIT_MODAL_OPTS } from '../../../utils/constants';


@IonicPage()
@Component({
  selector: 'view-receive',
  templateUrl: 'receive.html',
})
export class ReceiveView {

  protocolHandler: string;
  address: string;
  qrAddress: string;
  amount: number;
  amountMicros: number;
  availableUnits: Array<string>;
  amountCurrency: string;

  wallets;
  wallet;

  addressGenerationInProgress: boolean;

  error: string;
  mainAddressGapReached: boolean;

  hasUnlockedWallets:boolean;
  loading:boolean;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl: ModalController,
              private profileService: ProfileService,
              private walletService: WalletService,
              private loadCtrl: LoadingController,
              private toastCtrl: MeritToastController,
              private logger: Logger,
              private socialSharing: SocialSharing,
              private clipboard: Clipboard,
              private rateService: RateService,
              private configService: ConfigService,
              private events: Events) {
    this.protocolHandler = 'merit';
    this.availableUnits = [
      this.configService.get().wallet.settings.unitCode.toUpperCase(),
      this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase()
    ];
    this.amountCurrency = this.availableUnits[0];
  }

  async ionViewDidLoad() {
    // Get a new address if we just received an incoming TX (on an address we already have)
    this.events.subscribe('Remote:IncomingTx', (walletId, type, n) => {
      this.logger.info('Got an incomingTx on receive screen: ', n);
      if (this.wallet && this.wallet.id == walletId && n.data.address == this.address) {
        this.generateAddress();
      }
    });
  }

  async ionViewWillEnter() {
    this.loading = true;
    this.wallets = await this.profileService.getWallets();
    if (this.wallets) {
      this.hasUnlockedWallets = this.wallets.some(w => {
        if (w.unlocked) {
          this.wallet = w;
          this.generateAddress();
          return true;
        }
      });
    }
    this.loading = false;
  }

  async generateAddress() {
    this.addressGenerationInProgress = true;
    this.error = null;

    try {
      const address = await this.walletService.getAddress(this.wallet, false);
      this.address = address.address;
      this.addressGenerationInProgress = false;
      //if (forceNew) this.mainAddressGapReached = false; // that means, we  successfully generated NEW address
      this.formatAddress();
    } catch (err) {
      if (err.code == Errors.MAIN_ADDRESS_GAP_REACHED.code) {
        this.mainAddressGapReached = true;
        return this.generateAddress();
      } else {
        this.addressGenerationInProgress = false;

        if (err.text)
          this.error = err.text;

        return this.toastCtrl.create({
          message: err.text || 'Failed to generate new address',
          cssClass: ToastConfig.CLASS_ERROR
        }).present();
      }
    }
  }

  selectWallet() {
    const modal = this.modalCtrl.create('SelectWalletModal', {
      selectedWallet: this.wallet,
      availableWallets: this.wallets
    }, MERIT_MODAL_OPTS);
    modal.onDidDismiss((wallet) => {
      if (wallet) {
        this.wallet = wallet;
        this.generateAddress();
      }
    });
    return modal.present();
  }

  share() {
    if (SocialSharing.installed())
      return this.socialSharing.share(this.qrAddress);
  }

  copyToClipboard(addressString: string) {
    if (!addressString) return;

    const address = addressString.split(':')[1] || addressString;

    if (Clipboard.installed())
      this.clipboard.copy(address);

    this.toastCtrl.create({
      message: 'Address copied to clipboard',
      cssClass: ToastConfig.CLASS_MESSAGE
    }).present();
  }

  toCopayers() {
    this.navCtrl.push('CopayersView', { walletId: this.wallet.id, wallet: this.wallet });
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
    this.qrAddress = `${ this.protocolHandler }:${ this.address }${ this.amountMicros ? '?micros=' + this.amountMicros : '' }`;
  }

}
