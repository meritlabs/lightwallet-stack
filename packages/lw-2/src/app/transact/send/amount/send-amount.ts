import { Component, HostListener, SecurityContext } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import * as _ from 'lodash';
import { SendConfirmView } from 'merit/transact/send/confirm/send-confirm';
import { Logger } from 'merit/core/logger';
import { ProfileService } from "merit/core/profile.service";
import { ConfigService } from "merit/shared/config.service";
import { RateService } from 'merit/transact/rate.service';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';
import { TxFormatService } from "merit/transact/tx-format.service";
import { DomSanitizer } from '@angular/platform-browser';


@IonicPage()
@Component({
  selector: 'send-amount-view',
  templateUrl: 'send-amount.html',
})
export class SendAmountView {

  public contact: MeritContact;
  public sendingOptions: any[];
  public recipient: any;
  public amount: number;
  public amountMerit: number;
  public smallFont: boolean;
  public allowSend: boolean;
  public globalResult: string;
  public sending: boolean;
  public displayName: string;
  public wallets:any;
  public wallet:any;
  public amountCurrency:string;
  public loading:boolean;
  public hasFunds:boolean;
  public feeIncluded:boolean = false;

  public availableAmount = {value: 0, formatted: ''};


  private LENGTH_EXPRESSION_LIMIT = 19;
  private SMALL_FONT_SIZE_LIMIT = 10;
  private availableUnits: Array<any> = [];
  private unitIndex: number = 0;
  private reNr: RegExp = /^[1234567890\.]$/;
  private reOp: RegExp = /^[\*\+\-\/]$/;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private log: Logger,
    private profileService:ProfileService,
    private configService:ConfigService,
    private modalCtrl:ModalController,
    private rateService:RateService,
    private txFormatService:TxFormatService,
    private sanitizer:DomSanitizer

  ) {
    this.allowSend = false;
  }
  
  ionViewDidLoad() {
    this.loading = true;
    return this.profileService.hasFunds().then((hasFunds) => {
      this.hasFunds = hasFunds;
      this.contact = this.navParams.get('contact');
      this.sending = this.navParams.get('sending');
      this.displayName = !_.isEmpty(this.contact.name) ? this.contact.name.formatted : this.contact.meritAddresses[0].address;
      this.populateSendingOptions();

      this.profileService.getWallets().then((wallets) => {
        this.wallets = wallets;
        if (this.wallets && this.wallets[0]) {
          this.wallet = this.wallets[0];
        }

        this.getAvailableAmount().then((amount) => {
          this.availableAmount = amount;
        });
        this.loading = false;
      });

      this.availableUnits = [
        this.configService.get().wallet.settings.unitCode.toUpperCase(),
        this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase()
      ];
      this.amountCurrency = this.availableUnits[0];
    });
  }

  populateSendingOptions() {
    let empty = {
      sendMethod: '',
      meritAddress: '',
      email: '',
      phoneNumber: '',
      label: '',
    };
    this.sendingOptions = _.concat(
      _.map(this.contact.meritAddresses, (addrObject) => {
        return _.defaults({
          sendMethod: 'address',
          meritAddress: addrObject.address,
          label: `Merit: ${addrObject.address}`
        }, empty);
      }),
      _.map(this.contact.emails, (emailObj) => {
        return _.defaults({
          sendMethod: 'email',
          email: emailObj.value,
          label: `Email:  ${emailObj.value}`
        }, empty);
      }),
      _.map(this.contact.phoneNumbers, (phoneNumberObj) => {
        return _.defaults({
          sendMethod: 'sms',
          phoneNumber: phoneNumberObj.value,
          label: `SMS:  ${phoneNumberObj.value}`
        }, empty);
      })
    );
    this.recipient = _.head(this.sendingOptions);
  };

  selectWallet() {
    let modal = this.modalCtrl.create('SelectWalletModal', {selectedWallet: this.wallet, availableWallets: this.wallets});
    modal.present();
    modal.onDidDismiss((wallet) => {
      if (wallet) this.wallet = wallet;
    });
  }

  selectSendingOption() {
    let modal = this.modalCtrl.create('SelectSendingOptionModal', {
      selectedSendingOption: this.recipient,
      sendingOptions: this.sendingOptions
    });
    modal.present();
    modal.onDidDismiss((recipient) => {
      if(recipient) this.recipient = recipient;
    });
  }

  toggleCurrency() {
    this.amountCurrency = this.amountCurrency == this.availableUnits[0] ? this.availableUnits[1] : this.availableUnits[0];
    this.updateAmountMerit();
    this.getAvailableAmount().then((amount) => {
      this.availableAmount = amount;
    });
  }

  toggleFeeIncluded() {

  }


  updateAmountMerit() {
    if (this.amountCurrency.toUpperCase() == this.configService.get().wallet.settings.unitName.toUpperCase()) {
      this.amountMerit = this.amount;
    } else {
      this.amountMerit = this.rateService.fromFiatToMerit(this.amount, this.amountCurrency);
    }

  }

  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    if (!event.key) return;
    if (event.keyCode === 13) this.finish();
    this.processAmount();
  }

  checkFontSize() {
    if (this.amount && this.amount.toString().length >= this.SMALL_FONT_SIZE_LIMIT) this.smallFont = true;
    else this.smallFont = false;
  };

  processAmount() {
    this.updateAmountMerit();
  };

  sendAllowed() {
    return (
      this.amount > 0
      && this.amount <= this.availableAmount.value
    )
  }

  processResult(val: number) {
    // TODO: implement this function correctly - Need: txFormatService, isFiat, $filter
    this.log.info("processResult TODO");
    /*if (this.availableUnits[this.unitIndex].isFiat) return $filter('formatFiatAmount')(val);
    else return txFormatService.formatAmount(val.toFixed(unitDecimals) * unitToMicro, true);*/
  };

  fromFiat(val: number) {
    // TODO: implement next line correctly - Need: rateService
    //return parseFloat((rateService.fromFiatToMicros(val, fiatCode, availableUnits[altUnitIndex].id) * satToUnit).toFixed(unitDecimals));
  };

  toFiat(val) {
    // TODO: implement next line correctly - Need: rateService
    /*if (!rateService.getRate(fiatCode)) return;
    return parseFloat((rateService.fromMicrosToFiat(val * unitToMicro, fiatCode, availableUnits[unitIndex].id)).toFixed(2));*/
  };

  finish() {
    let amountMicros = this.rateService.mrtToMicro(this.amountMerit);
    this.navCtrl.push('SendConfirmView', {recipient: this.recipient, amount: amountMicros, wallet: this.wallet});
  }

  toBuyAndSell() {
    this.navCtrl.push('BuyAndSellView');
  }


  private getAvailableAmount():Promise<any> {
    return new Promise((resolve, reject) => {

      let currency = this.amountCurrency.toUpperCase();

      if (!this.wallet || !this.wallet.status) return resolve({value: 0, formatted: '0.0 '+currency});

      let amount = this.wallet.status.spendableAmount;

      if (this.amountCurrency.toUpperCase() == this.configService.get().wallet.settings.unitName.toUpperCase()) {
        let formatted = this.txFormatService.formatAmount(amount);
        return resolve({value: this.rateService.microsToMrt(amount), formatted: formatted+' '+currency});
      } else {
        let fiatAmount = this.rateService.fromMicrosToFiat(amount, currency);
        return resolve({value: fiatAmount, formatted: fiatAmount.toFixed(2)+' '+currency});
      }
    });
  }

  sanitizePhotoUrl(url:string) {
    return this.sanitizer.sanitize(SecurityContext.URL, url);
  }

}
