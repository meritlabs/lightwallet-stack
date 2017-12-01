import * as _ from "lodash";
import * as Promise from 'bluebird'; 

import { Component, HostListener } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VaultsService } from 'merit/vaults/vaults.service';
import { BwcService } from 'merit/core/bwc.service';
import { ProfileService } from 'merit/core/profile.service';
import { WalletService } from "merit/wallets/wallet.service";
import { Logger } from 'merit/core/logger';

@IonicPage({
  segment: 'vault/:vaultId/spend/amount',
  defaultHistory: ['VaultSpendAmountView']
})
@Component({
  selector: 'vault-spend-amount-view',
  templateUrl: 'vault-spend-amount.html',
})
export class VaultSpendAmountView {

    public recipient: any;
    public amount: string;
    public smallFont: boolean;
    public allowSend: boolean;
    public globalResult: string;
    public sending: boolean;
    public displayName: string;
    
    private LENGTH_EXPRESSION_LIMIT = 19;
    private SMALL_FONT_SIZE_LIMIT = 10;
    private availableUnits: Array<any> = [];
    private unitIndex: number = 0;
    private reNr: RegExp = /^[1234567890\.]$/;
    private reOp: RegExp = /^[\*\+\-\/]$/;

    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        private log: Logger
    ) {
        this.amount = '';
        this.allowSend = false;
    }

    ionViewDidLoad() {
        console.log('Params', this.navParams.data);
        this.recipient = this.navParams.get('recipient');
        console.log('recipient', this.recipient);
        this.sending = this.navParams.get('sending');
        this.displayName = !_.isEmpty(this.recipient.name) ? this.recipient.name : this.recipient.meritAddress;
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

      finish() {
        this.navCtrl.push('VaultSpendConfirmView', {});
      }
}
