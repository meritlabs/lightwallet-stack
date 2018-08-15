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
import { Store } from '@ngrx/store';
import { IRootAppState } from '../../../../../common/reducers';
import { Observable } from 'rxjs';
import {
  selectConfirmedWallets,
  selectWallets,
  selectWalletsLoading,
} from '../../../../../common/reducers/wallets.reducer';
import { DisplayWallet } from '../../../../../common/models/display-wallet';
import { ReceiveViewController } from '../../../../../common/controllers/receive-view.controller';

@IonicPage()
@Component({
  selector: 'view-receive',
  templateUrl: 'receive.html',
})
export class ReceiveView {
  ctrl: ReceiveViewController;

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
              private rnd: Renderer2,
              private store: Store<IRootAppState>) {
    this.ctrl = new ReceiveViewController(configService, store, toastCtrl);
    this.protocolHandler = 'merit';
    this.availableUnits = [
      this.configService.get().wallet.settings.unitCode.toUpperCase(),
      this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase()
    ];
    this.amountCurrency = this.availableUnits[0];
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
      console.log('Value is ', value);
      this.rnd.setStyle(el, 'bottom', value + 'px');
    }
  }

  focusInput() {
    this.amountInput.getNativeElement().focus();
  }

  selectWallet() {
    const modal = this.modalCtrl.create('SelectWalletModal', {
      selectedWallet: this.,
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
      && this.qrAddress
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
