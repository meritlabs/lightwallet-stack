import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { getEasySendURL } from '@merit/common/models/easy-send';
import { ISendMethod } from '@merit/common/models/send-method';
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
import { ISendTxData, SendService } from '@merit/common/services/send.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { cleanAddress, isAddress } from '@merit/common/utils/addresses';
import { SendValidator } from '@merit/common/validators/send.validator';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';
import { Store } from '@ngrx/store';
import { isEqual, omit } from 'lodash';
import 'rxjs/add/operator/isEmpty';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  share,
  skipWhile,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

interface Receipt {
  amount: number;
  fee: number;
  total: number;
  inWallet: number;
  remaining: number;
}

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

  easySendUrl: string;
  error: string;

  formData: FormGroup = this.formBuilder.group({
    amountMrt: ['', [Validators.required, SendValidator.validateAmount]],
    address: ['', [], [SendValidator.validateAddress(this.mwcService)]],
    selectedCurrency: [],
    feeIncluded: [false],
    wallet: [null, SendValidator.validateWallet],
    type: [],
    password: []
  });

  get amountMrt() {
    return this.formData.get('amountMrt');
  }

  get selectedCurrency() {
    return this.formData.get('selectedCurrency');
  }

  get feeIncluded() {
    return this.formData.get('feeIncluded');
  }

  get wallet() {
    return this.formData.get('wallet');
  }

  get type() {
    return this.formData.get('type');
  }

  get password() {
    return this.formData.get('password');
  }

  get address() {
    return this.formData.get('address');
  }

  canSend: boolean;
  sending: boolean;
  success: boolean;
  showTour: boolean = !('showTour' in localStorage && localStorage.getItem('showTour') === 'false');

  txData$: Observable<ISendTxData> = (this.formData.valueChanges as any).pipe(
    debounceTime(500),
    distinctUntilChanged((before: any, after: any) => {
      const b: any = omit(before, 'wallet');
      const a: any = omit(after, 'wallet');
      b.wallet = before.wallet ? before.wallet.id : null;
      a.wallet = after.wallet ? after.wallet.id : null;

      return isEqual(a, b);
    }),
    tap(() => {
      this.error = null;
      this.canSend = false;
    }),
    filter(() => this.formData.dirty),
    switchMap((formData) => {
      if (this.formData.pending) {
        // wait till form is validated
        return this.formData.statusChanges.pipe(
          skipWhile(() => this.formData.pending),
          take(1),
          map(() => formData)
        );
      }
      return of(formData);
    }),
    switchMap((formData) => {
      if (this.formData.valid) {
        this.receiptLoading = true;
        return fromPromise(this.createTx(formData))
          .pipe(
            catchError((err: any) => {
              console.log(err);
              this.error = err.message || 'Unknown error';
              return of({} as ISendTxData);
            })
          );
      }

      return of({} as ISendTxData);
    }),
    tap((txData: ISendTxData) => {
      if (txData && txData.txp) this.canSend = true;
    }),
    share()
  );

  submit: Subject<void> = new Subject<void>();
  onSubmit$: Observable<boolean> = this.submit.asObservable()
    .pipe(
      withLatestFrom(this.txData$),
      tap(() => {
        this.error = null;
        this.sending = true;
        this.easySendUrl = null;
      }),
      switchMap(([_, txData]) =>
        fromPromise(this.send(txData))
          .pipe(
            catchError(err => {
              this.error = err.message;
              return of(false);
            })
          )
      ),
      tap((success: boolean) => {
        this.sending = false;
        this.success = success;

        if (success) {
          this.resetFormData();
        }
      }),
      startWith(false),
      share()
    );


  receiptLoading: boolean;

  receipt$: Observable<Receipt> = combineLatest(this.txData$, this.onSubmit$)
    .pipe(
      map(([txData, submitSuccess]) => {
        const { feeIncluded, wallet } = this.formData.value;
        const { spendableAmount } = wallet ? wallet.status : 0;

        if (!txData || !txData.txp || this.success) {
          return {
            amount: 0,
            fee: 0,
            total: 0,
            inWallet: spendableAmount,
            remaining: spendableAmount
          };
        }

        this.receiptLoading = true;
        this.easySendUrl = void 0;
        this.success = void 0;

        const receipt: Receipt = {
          amount: txData.txp.amount,
          fee: txData.txp.fee + (txData.easyFee || 0),
          total: feeIncluded ? txData.txp.amount : txData.txp.amount + txData.txp.fee,
          inWallet: wallet.status.spendableAmount,
          remaining: 0
        };

        receipt.remaining = receipt.inWallet - receipt.total;

        return receipt;
      }),
      tap(() => this.receiptLoading = false),
      startWith({} as Receipt)
    );

  amountFiat$: Observable<number> = this.amountMrt.valueChanges.pipe(
    withLatestFrom(this.selectedCurrency.valueChanges),
    switchMap(([amountMrt, selectedCurrency]) =>
      fromPromise(
        this.rateService.microsToFiat(
          this.rateService.mrtToMicro(amountMrt),
          selectedCurrency.code
        )
      )
    )
  );

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
              private mwcService: MWCService,
              private toastCtrl: ToastControllerService) {
  }

  async ngOnInit() {
    this.availableCurrencies = await this.rateService.getAvailableFiats();

    await this.resetFormData();

    const query = await this.route.queryParams.pipe(take(1)).toPromise();
    const amount = parseFloat(query.amount);

    if (amount) {
      this.amountMrt.patchValue(amount);
      this.amountMrt.setErrors(null);
      this.amountMrt.markAsDirty();
    }

    this.type.valueChanges.pipe(
      filter((value: string) => (value === 'easy' && this.address.invalid) || (value === 'classic' && this.address.valid && !this.address.value)),
      tap(() => this.address.updateValueAndValidity({ onlySelf: false }))
    ).subscribe();

    this.onSubmit$.subscribe();
  }

  onGlobalSendCopy() {
    this.toastCtrl.success('Copied to clipboard');
  }

  ngAfterViewInit() {
    // temporary hack
    // TODO(ibby) find a better way to ensure we have an initial value for selected currency
    if (this.selectedCurrency.value) {
      setTimeout(() => {
        this.selectedCurrency.setValue(this.selectedCurrency.value);
      }, 1000);
    }
  }

  selectCurrency(currency) {
    this.selectedCurrency.setValue(currency);
  }

  private async resetFormData() {
    this.formData.reset({ emitEvent: false });

    const wallets = await this.wallets$.pipe(
      skipWhile(wallets => !wallets || !wallets.length),
      take(1)
    ).toPromise();

    this.hasUnlockedWallet = wallets.length > 0;
    this.hasAvailableInvites = wallets.some(w => w.availableInvites > 0);

    if (wallets && wallets[0]) {
      this.wallet.setValue(wallets[0], { emitEvent: false });
      if (wallets[0].status.spendableAmount <= 0) {
        wallets.some((wallet) => {
          if (wallet.status.spendableAmount > 0) {
            this.wallet.setValue(wallet, { emitEvent: false });
            return true;
          }
        });
      }
    }

    this.type.setValue('easy', { emitEvent: false });

    if (this.availableCurrencies.length) {
      this.selectCurrency(this.availableCurrencies[0]);
    }
  }

  selectWallet(wallet) {
    const { value } = this.wallet;
    if (!value || value.id !== wallet.id)
      this.wallet.setValue(wallet);
  }

  private async createTx(formValue: any): Promise<ISendTxData> {
    let txData: Partial<ISendTxData> = {};
    let { amountMrt, wallet, type, feeIncluded, password, address } = formValue;

    address = cleanAddress(address);

    const micros = this.rateService.mrtToMicro(amountMrt);

    if (micros == wallet.balance.spendableAmount) {
      feeIncluded = true;
      this.feeIncluded.setValue(true, { emitEvent: false });
    }

    if (type === 'easy') {
      const easySend = await this.easySendService.createEasySendScriptHash(wallet.client, password);
      txData.easySend = easySend;
      txData.txp = await this.easySendService.prepareTxp(wallet.client, micros, easySend);
      txData.easySendUrl = getEasySendURL(easySend);
      txData.referralsToSign = [easySend.scriptReferralOpts];

      if (!feeIncluded) { //if fee is included we pay also easyreceive tx, so recipient can have the exact amount that is displayed
        txData.easyFee = await this.feeService.getEasyReceiveFee();
      }
    } else {
      if (!isAddress(address)) {
        const info = await this.addressService.getAddressInfo(address);
        address = info.address;
      }

      txData.txp = await this.sendService.prepareTxp(wallet.client, micros, address);
    }

    if (!txData.txp) {
      throw new Error('Error occurred when calculating transaction details');
    }

    return txData as ISendTxData;
  }

  async send(txData: ISendTxData) {
    if (txData.easyFee) txData.txp.amount += txData.easyFee;

    const wallet = this.wallet.value;

    txData.sendMethod = { type: this.type.value } as ISendMethod;

    await this.sendService.send(txData, wallet.client);

    this.easySendUrl = txData.easySendUrl;

    setTimeout(() => {
      this.store.dispatch(new RefreshOneWalletAction(wallet.id, {
        skipRewards: true,
        skipAlias: true,
        skipShareCode: true
      }));
    }, 1750);

    return true;
  }

  hideTour() {
    this.showTour = false;
    localStorage.setItem('showTour', 'false');
  }
}
