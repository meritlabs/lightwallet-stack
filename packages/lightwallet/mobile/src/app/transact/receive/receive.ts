import { Component } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Events, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { ProfileService } from '@merit/common/providers/profile';
import { WalletService } from '@merit/common/providers/wallet';
import { LoggerService } from '@merit/common/providers/logger';
import { RateService } from '@merit/common/providers/rate';
import { ConfigService } from '@merit/common/providers/config';
import { PlatformService } from '@merit/common/providers/platform';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { MWCErrors } from '@merit/common/merit-wallet-client/lib/errors';
import { MeritToastController, ToastConfig } from '@merit/common/providers/toast.controller';
import { SendService } from '@merit/common/providers/send';

@IonicPage()
@Component({
  selector: 'view-receive',
  templateUrl: 'receive.html',
})
export class ReceiveView {
  protocolHandler: string;
  address: string;
  alias: string;
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

  hasUnlockedWallets: boolean;
  loading: boolean;

  constructor(private navCtrl: NavController,
              private modalCtrl: ModalController,
              private profileService: ProfileService,
              private walletService: WalletService,
              private toastCtrl: MeritToastController,
              private logger: LoggerService,
              private socialSharing: SocialSharing,
              private clipboard: Clipboard,
              private rateService: RateService,
              private configService: ConfigService,
              private events: Events,
              private sendService: SendService,
              private platformService: PlatformService,
              private navParams: NavParams) {
    this.protocolHandler = 'merit';
    this.availableUnits = [
      this.configService.get().wallet.settings.unitCode.toUpperCase(),
      this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase()
    ];
    this.amountCurrency = this.availableUnits[0];
  }

  ionViewDidLoad() {
    // Get a new address if we just received an incoming TX (on an address we already have)
    this.events.subscribe('Remote:IncomingTx', (walletId, type, n) => {
      this.logger.info('Got an incomingTx on receive screen: ', n);
      if (this.wallet && this.wallet.id == walletId && n.data.address == this.address) {
        this.generateAddress();
      }
    });
  }

  ionViewWillEnter() {
    return this.loadData();
  }

  async loadData() {
    if (this.loading) return;
    this.loading = true;
    this.wallets = await this.profileService.getWallets();
    if (this.wallets) {
      this.hasUnlockedWallets = this.wallets.some(w => {
        if (w.confirmed) {
          this.wallet = w;
          this.generateAddress();
          return true;
        }
      });
    }

    const { wallet } = this.navParams.data;

    if (wallet) {
      this.wallet = wallet;
    }

    this.loading = false;
  }

  async generateAddress() {
    this.addressGenerationInProgress = true;
    this.error = null;

    try {
      this.address = this.walletService.getRootAddress(this.wallet).toString();
      let info = await this.sendService.getAddressInfo(this.address);
      this.alias = info.alias;
      this.addressGenerationInProgress = false;
      this.formatAddress();
    } catch (err) {
      if (err.code == MWCErrors.MAIN_ADDRESS_GAP_REACHED.code) {
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

  showShareButton() {
    return (
      this.platformService.isCordova
      && this.wallet
      && this.wallet.isComplete()
      && this.qrAddress
      && !this.addressGenerationInProgress
    );
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
    if (this.rateService.getRate(this.availableUnits[1]) > 0) {
      this.amountCurrency = this.amountCurrency == this.availableUnits[0] ? this.availableUnits[1] : this.availableUnits[0];
      this.changeAmount();
    }
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
