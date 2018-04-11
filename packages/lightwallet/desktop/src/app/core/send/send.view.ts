import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { getEasySendURL } from '@merit/common/models/easy-send';
import { IRootAppState } from '@merit/common/reducers';
import {
  RefreshOneWalletAction, selectConfirmedWallets,
  UpdateOneWalletAction
} from '@merit/common/reducers/wallets.reducer';
import { AddressService } from '@merit/common/services/address.service';
import { ConfigService } from '@merit/common/services/config.service';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { FeeService } from '@merit/common/services/fee.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { RateService } from '@merit/common/services/rate.service';
import { SendService } from '@merit/common/services/send.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';
import { Store } from '@ngrx/store';
import { debounce } from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'view-send',
  templateUrl: './send.view.html',
  styleUrls: ['./send.view.sass']
})
export class SendView implements OnInit {

  wallets$: Observable<DisplayWallet[]>;

  hasUnlockedWallet: boolean;
  hasAvailableInvites: boolean;

  availableCurrencies: Array<{ code: string; name: string; rate: number; }>;
  selectedCurrency: { code: string };

  easySendUrl: string;
  error: string;

  formData: {
    amountMrt: number,
    amountFiat: number,
    feeIncluded: boolean,
    wallet: DisplayWallet,
    address: string,
    validatedAddress: any,
    validatedAlias: string,
    type: string //classic|easy
    password: string
  } = <any>{};

  txData: any;

  receipt: any = {};

  sending: boolean;
  success: boolean;
  addressLoading: boolean;

  constructor(private route: ActivatedRoute,
              private store: Store<IRootAppState>,
              private formBuilder: FormBuilder,
              private logger: LoggerService,
              private rateService: RateService,
              private configService: ConfigService,
              private walletService: WalletService,
              private passwordPromptCtrl: PasswordPromptController,
              private addressService: AddressService,
              private easySendService: EasySendService,
              private sendService: SendService,
              private feeService: FeeService) {
    this.resetFormData();
  }

  private resetFormData() {
    this.formData = {
      amountMrt: undefined,
      amountFiat: undefined,
      feeIncluded: false,
      address: '',
      wallet: this.formData.wallet,
      type: 'classic', //classic|easy
      password: '',
      validatedAddress: undefined,
      validatedAlias: undefined
    };

    this.resetReceipt();
  }

  private resetReceipt() {
    this.receipt = {
      loading: false,
      calculated: false,
      amount: 0,
      fee: 0,
      total: 0,
      inWallet: 0,
      totalRemaining: 0,
      easySendUrl: ''
    };
  }

  private createTxDebounce = debounce(() => { this.createTx(); }, 500);
  private validateAddressDebounce = debounce(async () => {
    await this.validateAddress();
    this.updateTx();
  }, 500);

  selectWallet(wallet) {
    this.formData.wallet = wallet;
    this.updateTx();
  }

  async updateTx() {
    this.receipt.loading = true;
    this.receipt.calculated = false;
    this.success = false;
    await this.updateAmount();

    if (
      !parseFloat(this.formData.amountMrt + '')
      || this.formData.amountMrt <= 0
      || (!this.formData.validatedAddress && this.formData.type == 'classic')
      || this.error
      || !this.formData.wallet
    ) {
      this.receipt.loading = false;
      this.createTxDebounce.cancel();
    } else {
      this.createTxDebounce();
    }
  }

  async updateTxType(type) {
    this.formData.type = type;
    this.updateTx();
  }

  async updateAddress() {
    this.addressLoading = true;

    if (this.formData.address) {
      this.addressLoading = false;
      this.validateAddressDebounce.cancel();
    }

    this.validateAddressDebounce();
  }

  /**
   *
   * converting mrt value to fiat
   */
  private async updateAmount() {
    this.error = '';
    let micros = this.rateService.mrtToMicro(this.formData.amountMrt);
    if (this.selectedCurrency) {
      this.formData.amountFiat = await this.rateService.microsToFiat(micros, this.selectedCurrency.code);
    }
  }

  async ngOnInit() {
    this.wallets$ = this.store.select(selectConfirmedWallets);
    this.wallets$.subscribe(wallets => {
      this.hasUnlockedWallet = wallets.length > 0;
      this.hasAvailableInvites = wallets.some(w => w.availableInvites > 0);

      if (wallets && wallets[0]) {
        this.formData.wallet = wallets[0];
        wallets.some((wallet) => {
          if (wallet.status.spendableAmount > 0) {
            this.formData.wallet = wallet;
            return true;
          }
        });
      }
    });
    this.availableCurrencies = await this.rateService.getAvailableFiats();
  }

  async createTx() {

    this.txData = {};

    try {
      let micros = this.rateService.mrtToMicro(this.formData.amountMrt);
      if (micros == this.formData.wallet.balance.spendableAmount) this.formData.feeIncluded = true;

      if (this.formData.type == 'easy') {
        const easySend = await  this.easySendService.createEasySendScriptHash(this.formData.wallet.client, this.formData.password);
        this.txData.easySend = easySend;
        this.txData.txp = await this.easySendService.prepareTxp(this.formData.wallet.client, micros, easySend);
        this.txData.easySendUrl = getEasySendURL(easySend);
        this.txData.referralsToSign = [easySend.scriptReferralOpts];

        if (!this.formData.feeIncluded) { //if fee is included we pay also easyreceive tx, so recipient can have the exact amount that is displayed
          this.txData.easyFee = await this.feeService.getEasyReceiveFee();
        }
      } else {
        this.txData.txp = await this.sendService.prepareTxp(this.formData.wallet.client, micros, this.formData.validatedAddress);
      }

      if (!this.txData.txp) {
        throw new Error('Error occured when calculating transaction details');
      }
      this.receipt.amount = this.txData.txp.amount;
      this.receipt.fee = this.txData.txp.fee + (this.txData.easyFee || 0);
      this.receipt.total = this.formData.feeIncluded ? this.txData.txp.amount : this.txData.txp.amount + this.txData.txp.fee;

      this.receipt.calculated = true;
    } catch (err) {
      console.log(err);
      this.error = err.message || 'Unknown error';
    }

    this.receipt.loading = false;
  }


  private async validateAddress() {
    this.formData.validatedAddress = '';
    this.formData.validatedAlias = '';
    let input = this.formData.address.replace(/\s+/g, '');
    if (input.charAt(0) == '@') input = input.slice(1);

    if (!input) return false;
    try {
      if (this.addressService.couldBeAlias(input) || this.addressService.isAddress(input)) {

        let addressInfo = await this.addressService.getAddressInfo(input);
        if (!addressInfo.isConfirmed) {
          this.error = 'Address not confirmed';
        } else {
          this.error = '';
          this.formData.validatedAddress = addressInfo.address;
          this.formData.validatedAlias = addressInfo.alias;
          return true;
        }
      } else {
        this.error = 'Alias/address not found';
      }
    } catch (e) {
      this.error = 'Cannot validate address';
    }
  }

  async send() {

    this.error = null;
    this.sending = true;

    if (this.txData.easyFee) this.txData.txp.amount += this.txData.easyFee;

    if (!this.txData.txp) await this.createTx();

    this.txData.txp = await this.sendService.finalizeTxp(this.formData.wallet.client, this.txData.txp, this.formData.feeIncluded);

    try {
      if (this.txData.referralsToSign) {
        for (let referral of this.txData.referralsToSign) {
          await this.formData.wallet.client.sendReferral(referral);
          await this.formData.wallet.client.sendInvite(referral.address);
        }
      }

      if (!this.formData.wallet.client.canSign() && !this.formData.wallet.client.isPrivKeyExternal()) {
        this.logger.info('No signing proposal: No private key');
        await this.walletService.onlyPublish(this.formData.wallet.client, this.txData.txp);
      } else {
        await this.walletService.publishAndSign(this.formData.wallet.client, this.txData.txp);
      }

      if (this.formData.type == 'easy') {
        this.easySendUrl = this.txData.easySendUrl;
      }
      this.success = true;

      this.store.dispatch(new RefreshOneWalletAction(this.formData.wallet.id, {
        skipRewards: true,
        skipAlias: true,
        skipShareCode: true
      }));

      this.resetFormData();

    } catch (e) {
      console.log(e);
      this.error = e.message;
    }

    this.txData = {};
    this.sending = false;

  }


}
