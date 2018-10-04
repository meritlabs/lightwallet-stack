import { Component, Renderer2, ViewChild } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Button, Events, Footer, IonicPage, ModalController, NavController, NavParams, TextInput } from 'ionic-angular';
import { ProfileService } from '@merit/common/services/profile.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { RateService } from '@merit/common/services/rate.service';
import { ConfigService } from '@merit/common/services/config.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { MWCErrors } from '@merit/common/merit-wallet-client/lib/errors';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { AddressService } from '@merit/common/services/address.service';

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

  @ViewChild('amountInput') amountInput: TextInput;
  @ViewChild(Footer) footer: Footer;

  private footerHeight: number;
  private toggleButtonHeight: number;
  private footerBottom: number;
  isFooterCollapsed: boolean;

  constructor(private navCtrl: NavController,
              private modalCtrl: ModalController,
              private profileService: ProfileService,
              private walletService: WalletService,
              private toastCtrl: ToastControllerService,
              private logger: LoggerService,
              private socialSharing: SocialSharing,
              private clipboard: Clipboard,
              private rateService: RateService,
              private configService: ConfigService,
              private events: Events,
              private addressService: AddressService,
              private platformService: PlatformService,
              private navParams: NavParams,
              private rnd: Renderer2) {
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

  toggleFooter() {
    const el: HTMLElement = this.footer.getNativeElement();

    if (!this.footerHeight)
      this.footerHeight = el.offsetHeight;

    if (!this.footerBottom)
      this.footerBottom = parseInt(el.style.bottom.replace(/\D+/g, ''));


    if (this.isFooterCollapsed) {
      this.isFooterCollapsed = false;
      this.rnd.setStyle(el, 'bottom', this.footerBottom + 'px');
    } else {
      this.isFooterCollapsed = true;
      const value = -1 * this.footerHeight + this.footerBottom + 40;
      this.rnd.setStyle(el, 'bottom', value + 'px');
    }
  }

  focusInput() {
    this.amountInput.getNativeElement().focus();
  }

  async loadData() {
    if (this.loading) return;
    this.loading = true;
    this.wallets = await this.profileService.getWallets();

    this.hasUnlockedWallets = this.wallets.some(w => {
      if (w.confirmed) {
        this.wallet = w;
        return true;
      }
    });

    const { wallet } = this.navParams.data;
    if (wallet && wallet.confirmed) {
      this.wallet = wallet;
    }

    if (this.wallet)  this.generateAddress();

    this.loading = false;
  }

  async generateAddress() {
    this.addressGenerationInProgress = true;
    this.error = null;

    try {
      this.address = this.wallet.getRootAddress().toString();
      this.addressGenerationInProgress = false;
      this.formatAddress();
      let info = await this.addressService.getAddressInfo(this.address);
      this.alias = info.alias;
    } catch (err) {
      if (err.code == MWCErrors.MAIN_ADDRESS_GAP_REACHED.code) {
        this.mainAddressGapReached = true;
        return this.generateAddress();
      } else {
        this.addressGenerationInProgress = false;

        if (err.text)
          this.error = err.text;

        return this.toastCtrl.error(err.text || 'Failed to generate new address');
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

    this.toastCtrl.message('Address copied to clipboard');
  }

  async toggleCurrency() {
    const rate = await this.rateService.getRate(this.availableUnits[1]);
    if (rate > 0) {
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
