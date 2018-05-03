import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { getEasySendURL } from '@merit/common/models/easy-send';
import { IRootAppState } from '@merit/common/reducers';
import { RefreshOneWalletAction, selectConfirmedWallets } from '@merit/common/reducers/wallets.reducer';
import { AddressService } from '@merit/common/services/address.service';
import { ConfigService } from '@merit/common/services/config.service';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { FeeService } from '@merit/common/services/fee.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { RateService } from '@merit/common/services/rate.service';
import { SendService } from '@merit/common/services/send.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { AddressValidator } from '@merit/common/validators/address.validator';
import { SendValidator } from '@merit/common/validators/send.validator';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';
import { Store } from '@ngrx/store';
import { clone, debounce } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { map, switchMap, take } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'view-send',
  templateUrl: './send.view.html',
  styleUrls: ['./send.view.sass']
})
export class SendView implements OnInit {

  wallets$: Observable<DisplayWallet[]> = this.store.select(selectConfirmedWallets);

  hasUnlockedWallet: boolean;
  hasAvailableInvites: boolean;

  availableCurrencies: Array<{ code: string; name: string; rate: number; }>;
  // selectedCurrency: { code: string };

  easySendUrl: string;
  error: string;

  _formData: {
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

  formData: FormGroup = this.formBuilder.group({
    amountMrt: ['', [Validators.required]],
    address: ['', [SendValidator.validateAddressRequirement], [AddressValidator.validateAddress(this.mwcService)]],
    selectedCurrency: [null],
    feeIncluded: [false],
    wallet: [null, SendValidator.validateWallet],
    type: ['classic'],
    password: ['']
  });

  get amountMrt() { return this.formData.get('amountMrt'); }
  get selectedCurrency() { return this.formData.get('selectedCurrency'); }
  get feeIncluded() { return this.formData.get('feeIncluded'); }
  get wallet() { return this.formData.get('wallet'); }
  get type() { return this.formData.get('type'); }
  get password() { return this.formData.get('password'); }
  get address() { return this.formData.get('address'); }

  receipt$ = this.formData.valueChanges.pipe(
    map((value) => {

    })
  );

  txData: any;
  receipt: any = {};
  sending: boolean;
  success: boolean;
  addressLoading: boolean;
  showTour: boolean = !('showTour' in localStorage && localStorage.getItem('showTour') === 'false');

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
              private feeService: FeeService,
              private persistenceService: PersistenceService2,
              private mwcService: MWCService) {}

  async ngOnInit() {
    const wallets = await this.wallets$.pipe(take(1)).toPromise();

    this.hasUnlockedWallet = wallets.length > 0;
    this.hasAvailableInvites = wallets.some(w => w.availableInvites > 0);

    if (wallets && wallets[0]) {
      this.wallet.setValue(wallets[0], { emitChanges: false });
      if (wallets[0].status.spendableAmount <= 0) {
        wallets.some((wallet) => {
          if (wallet.status.spendableAmount > 0) {
            this.wallet.setValue(wallet, { emitChanges: false });
            return true;
          }
        });
      }
    }

    this.availableCurrencies = await this.rateService.getAvailableFiats();
  }

  private resetFormData() {
    this.formData.reset();
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

  selectWallet(wallet) {
    this.wallet.setValue(wallet);
  }

  async updateTxType(type) {
    this.type.setValue(type);
  }

  // async updateAddress() {
  //   this.addressLoading = true;
  //
  //   if (this.formData.address) {
  //     this.addressLoading = false;
  //     this.validateAddressDebounce.cancel();
  //   }
  //
  //   this.validateAddressDebounce();
  // }
  //
  // /**
  //  *
  //  * converting mrt value to fiat
  //  */
  // private async updateAmount() {
  //   this.error = '';
  //   let micros = this.rateService.mrtToMicro(this.formData.amountMrt);
  //   if (this.selectedCurrency) {
  //     this.formData.amountFiat = await this.rateService.microsToFiat(micros, this.selectedCurrency.code);
  //   }
  // }


  async createTx() {

    this.txData = {};

    let { amountMrt, wallet, type, feeIncluded, password, address } = this.formData.value;

    try {
      let micros = this.rateService.mrtToMicro(amountMrt);

      if (micros == wallet.balance.spendableAmount) {
        feeIncluded = true;
        this.feeIncluded.setValue(true, { emitEvent: false });
      }

      if (type === 'easy') {
        const easySend = await this.easySendService.createEasySendScriptHash(wallet.client, password);
        this.txData.easySend = easySend;
        this.txData.txp = await this.easySendService.prepareTxp(wallet.client, micros, easySend);
        this.txData.easySendUrl = getEasySendURL(easySend);
        this.txData.referralsToSign = [easySend.scriptReferralOpts];

        if (!feeIncluded) { //if fee is included we pay also easyreceive tx, so recipient can have the exact amount that is displayed
          this.txData.easyFee = await this.feeService.getEasyReceiveFee();
        }
      } else {
        this.txData.txp = await this.sendService.prepareTxp(wallet.client, micros, address);
      }

      if (!this.txData.txp) {
        throw new Error('Error occured when calculating transaction details');
      }
      this.receipt.amount = this.txData.txp.amount;
      this.receipt.fee = this.txData.txp.fee + (this.txData.easyFee || 0);
      this.receipt.total = feeIncluded ? this.txData.txp.amount : this.txData.txp.amount + this.txData.txp.fee;

      this.receipt.calculated = true;
    } catch (err) {
      console.log(err);
      this.error = err.message || 'Unknown error';
    }

    this.receipt.loading = false;
  }


  // private async validateAddress() {
  //   this.formData.validatedAddress = '';
  //   this.formData.validatedAlias = '';
  //   let input = this.formData.address.replace(/\s+/g, '');
  //   if (input.charAt(0) == '@') input = input.slice(1);
  //
  //   if (!input) return false;
  //   try {
  //     if (this.addressService.couldBeAlias(input) || this.addressService.isAddress(input)) {
  //
  //       let addressInfo = await this.addressService.getAddressInfo(input);
  //       if (!addressInfo.isConfirmed) {
  //         this.error = 'Address not confirmed';
  //       } else {
  //         this.error = '';
  //         this.formData.validatedAddress = addressInfo.address;
  //         this.formData.validatedAlias = addressInfo.alias;
  //         return true;
  //       }
  //     } else {
  //       this.error = 'Alias/address not found';
  //     }
  //   } catch (e) {
  //     this.error = 'Cannot validate address';
  //   }
  // }

  async send() {
    this.error = null;
    this.sending = true;
    this.easySendUrl = void 0;

    if (this.txData.easyFee) this.txData.txp.amount += this.txData.easyFee;

    if (!this.txData.txp) await this.createTx();

    const wallet = this.wallet.value;

    this.txData.txp = await this.sendService.finalizeTxp(wallet.client, this.txData.txp, this.feeIncluded.value);

    try {
      if (this.txData.referralsToSign) {
        for (let referral of this.txData.referralsToSign) {
          await wallet.client.sendReferral(referral);
          await wallet.client.sendInvite(referral.address);
        }
      }

      if (!wallet.client.canSign() && !wallet.client.isPrivKeyExternal()) {
        this.logger.info('No signing proposal: No private key');
        await this.walletService.onlyPublish(wallet.client, this.txData.txp);
      } else {
        await this.walletService.publishAndSign(wallet.client, this.txData.txp);
      }

      if (this.type.value === 'easy') {
        this.easySendUrl = this.txData.easySendUrl;
        await this.persistenceService.addEasySend(clone(this.txData.easySend));
      }
      this.success = true;

      this.store.dispatch(new RefreshOneWalletAction(wallet.id, {
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

  hideTour() {
    this.showTour = false;
    localStorage.setItem('showTour', 'false');
  }
}
