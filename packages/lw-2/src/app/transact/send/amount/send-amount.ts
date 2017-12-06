import { Component, HostListener } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import * as _ from 'lodash';
import { SendConfirmView } from 'merit/transact/send/confirm/send-confirm';
import { Logger } from 'merit/core/logger';
import { ProfileService } from "merit/core/profile.service";
import { ConfigService } from "merit/shared/config.service";
import { RateService } from 'merit/transact/rate.service';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';


@IonicPage()
@Component({
  selector: 'send-amount-view',
  templateUrl: 'send-amount.html',
})
export class SendAmountView {

  public contact: MeritContact;
  public sendingOptions: any[];
  public recipient: any;
  public amount: string;
  public amountMerit: string;
  public smallFont: boolean;
  public allowSend: boolean;
  public globalResult: string;
  public sending: boolean;
  public displayName: string;
  public wallets:any;
  public wallet:any;
  public amountCurrency:string;


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
    private rateService:RateService
  ) {
    this.amount = '';
    this.allowSend = false;
  }
  
  ionViewDidLoad() {
    console.log('Params', this.navParams.data);
    this.contact = this.navParams.get('contact');
    this.sending = this.navParams.get('sending');
    this.displayName = !_.isEmpty(this.contact.name) ? this.contact.name.formatted : this.contact.meritAddresses[0].address;
    this.populateSendingOptions();

    this.profileService.getWallets().then((wallets) => {
      this.wallets = wallets;
      if (this.wallets && this.wallets[0]) {
        this.wallet = this.wallets[0];
      }
    });

    this.availableUnits = [
      this.configService.get().wallet.settings.unitCode.toUpperCase(),
      this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase()
    ];
    this.amountCurrency = this.availableUnits[0];
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
          label: addrObject.address
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
    this.changeAmount();
  }

  changeAmount() {

    if (this.amountCurrency.toUpperCase() == this.configService.get().wallet.settings.unitName.toUpperCase()) {
      this.amountMerit = this.amount;
    } else {
      this.amountMerit = this.rateService.fromFiat(this.amount, this.amountCurrency).toString();
    }
  }

  hasFunds() {
    //todo implement
    return true;
  }


  
  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    if (!event.key) return;
    if (event.which === 8) {
      event.preventDefault();
      this.removeDigit();
    }

    if (event.key.match(this.reNr)) {
      this.pushDigit(event.key);
    } else if (event.key.match(this.reOp)) {
      this.pushOperator(event.key);
    } else if (event.keyCode === 86) {
      // if (event.ctrlKey || event.metaKey) processClipboard();
    } else if (event.keyCode === 13) this.finish();
  }

  pushDigit(digit: string) {
    if (this.amount && this.amount.length >= this.LENGTH_EXPRESSION_LIMIT) return;
    if (this.amount.indexOf('.') > -1 && digit == '.') return;
    // TODO: next line - Need: isFiat
    //if (this.availableUnits[this.unitIndex].isFiat && this.amount.indexOf('.') > -1 && this.amount[this.amount.indexOf('.') + 2]) return;

    this.amount = (this.amount + digit).replace('..', '.');
    this.checkFontSize();
    this.processAmount();
  };

  removeDigit() {
    this.amount = (this.amount).toString().slice(0, -1);
    this.processAmount();
    this.checkFontSize();
  };

  pushOperator(operator: string) {
    if (!this.amount || this.amount.length == 0) return;
    this.amount = this._pushOperator(this.amount, operator);
  };

  private _pushOperator(val: string, operator: string) {
    if (!this.isOperator(_.last(val))) {
      return val + operator;
    } else {
      return val.slice(0, -1) + operator;
    }
  };

  isOperator(val: string) {
    const regex = /[\/\-\+\x\*]/;
    return regex.test(val);
  };

  isExpression(val: string) {
    const regex = /^\.?\d+(\.?\d+)?([\/\-\+\*x]\d?\.?\d+)+$/;
    return regex.test(val);
  };

  checkFontSize() {
    if (this.amount && this.amount.length >= this.SMALL_FONT_SIZE_LIMIT) this.smallFont = true;
    else this.smallFont = false;
  };

  processAmount() {
    var formatedValue = this.format(this.amount);
    var result = this.evaluate(formatedValue);
    this.allowSend = _.isNumber(result) && +result > 0;
    if (_.isNumber(result)) {
      this.globalResult = this.isExpression(this.amount) ? '= ' + this.processResult(result) : '';

      // TODO this.globalResult is always undefinded - Need: processResult()
      /* if (this.availableUnits[this.unitIndex].isFiat) {

        var a = this.fromFiat(result);
        if (a) {
          this.alternativeAmount = txFormatService.formatAmount(a * unitToMicro, true);
        } else {
          this.alternativeAmount = 'N/A'; //TODO
          this.allowSend = false;
        }
      } else {
        this.alternativeAmount = $filter('formatFiatAmount')(toFiat(result));
      } */
      this.globalResult = result.toString();
    }
  };

  format(val: string) {
    if (!val) return;

    var result = val.toString();

    if (this.isOperator(_.last(val))) result = result.slice(0, -1);

    return result.replace('x', '*');
  };

  evaluate(val: string) {
    var result;
    try {
      result = eval(val);
    } catch (e) {
      return 0;
    }
    if (!_.isFinite(result)) return 0;
    return result;
  };

  processResult(val: number) {
    // TODO: implement this function correctly - Need: txFormatService, isFiat, $filter
    this.log.info("processResult TODO");
    /*if (this.availableUnits[this.unitIndex].isFiat) return $filter('formatFiatAmount')(val);
    else return txFormatService.formatAmount(val.toFixed(unitDecimals) * unitToMicro, true);*/
  };

  fromFiat(val: number) {
    // TODO: implement next line correctly - Need: rateService
    //return parseFloat((rateService.fromFiat(val, fiatCode, availableUnits[altUnitIndex].id) * satToUnit).toFixed(unitDecimals));
  };

  toFiat(val) {
    // TODO: implement next line correctly - Need: rateService
    /*if (!rateService.getRate(fiatCode)) return;
    return parseFloat((rateService.toFiat(val * unitToMicro, fiatCode, availableUnits[unitIndex].id)).toFixed(2));*/
  };

  finish() {
    // TODO: We should always be sending from view.
    this.navCtrl.push('SendConfirmView', {recipient: this.recipient, toAmount: parseInt(this.globalResult), wallet: this.navParams.get('wallet'), toName: 'Donken Heinz'});
  }
}
