import { Observable } from 'rxjs/Observable';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { RefreshOneWalletAction, selectConfirmedWallets, selectInvites } from '@merit/common/reducers/wallets.reducer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SendValidator } from '@merit/common/validators/send.validator';
import { ISendMethod, SendMethodType } from '@merit/common/models/send-method';
import { ISendTxData, SendService } from '@merit/common/services/send.service';
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
  withLatestFrom,
} from 'rxjs/operators';
import { isEqual, omit } from 'lodash';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { LoadingControllerService } from '@merit/common/services/loading-controller.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { cleanAddress } from '@merit/common/utils/addresses';
import { getSendMethodDestinationType } from '@merit/common/utils/destination';
import { microsToMrt, mrtToMicro } from '@merit/common/utils/format';
import { LoggerService } from '@merit/common/services/logger.service';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { RateService } from '@merit/common/services/rate.service';

export interface IReceipt {
  amount: number;
  fee: number;
  total: number;
  inWallet: number;
  remaining: number;
}

export class SendFormController {
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectConfirmedWallets);
  invites$: Observable<number> = this.store.select(selectInvites);

  hasUnlockedWallet: boolean;
  hasAvailableInvites: boolean;

  availableCurrencies: Array<{ code: string; name: string; rate: number; }>;

  easySendUrl: string;
  easySendDelivered: boolean;
  error: string;

  formData: FormGroup = this.formBuilder.group({
    amountMrt: ['', [Validators.required, SendValidator.validateAmount]],
    address: ['', [], [SendValidator.validateAddress()]],
    selectedCurrency: [],
    feeIncluded: [false],
    wallet: [null, SendValidator.validateWallet],
    type: [SendMethodType.Easy],
    password: [],
    confirmPassword: ['', SendValidator.validatePasswordConfirm],
    destination: ['', SendValidator.validateGlobalSendDestination],
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

  get passwordConfirm() {
    return this.formData.get('passwordConfirm');
  }

  get address() {
    return this.formData.get('address');
  }

  get destination() {
    return this.formData.get('destination');
  }

  canSend: boolean;
  sending: boolean;
  overMaximumAmount: boolean;
  success: boolean;

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
      this.overMaximumAmount = false;
    }),
    filter(() => this.formData.dirty),
    switchMap((formData) => {
      if (this.formData.pending) {
        // wait till form is validated
        return this.formData.statusChanges.pipe(
          skipWhile(() => this.formData.pending),
          take(1),
          map(() => formData),
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
            }),
          );
      }

      return of({} as ISendTxData);
    }),
    tap((txData: ISendTxData) => {
      if (txData && txData.txp) this.canSend = true;
    }),
    share(),
  );

  submit: Subject<void> = new Subject<void>();
  onSubmit$: Observable<boolean> = this.submit.asObservable()
    .pipe(
      withLatestFrom(this.txData$),
      tap(() => {
        this.sending = true;
        this.loadingCtrl.show();
        this.error = this.easySendUrl = this.easySendDelivered = null;
      }),
      switchMap(([_, txData]) =>
        fromPromise(this.send(txData))
          .pipe(
            catchError(err => {
              this.error = err.message;
              return of(false);
            }),
          ),
      ),
      tap((success: boolean) => {
        this.sending = false;
        this.loadingCtrl.hide();
        this.success = success;

        if (success) {
          this.resetFormData();
        }
      }),
      startWith(false),
      share(),
    );


  receiptLoading: boolean;

  receipt$: Observable<IReceipt> = combineLatest(this.txData$, this.onSubmit$)
    .pipe(
      map(([txData, submitSuccess]) => {
        const { feeIncluded, wallet } = this.formData.value;
        const { spendableAmount } = wallet ? wallet.balance : 0;

        if (!txData || this.success) {
          return {
            amount: 0,
            fee: 0,
            total: 0,
            inWallet: spendableAmount,
            remaining: spendableAmount,
          };
        }

        this.receiptLoading = true;

        const receipt: IReceipt = {
          amount: txData.amount,
          fee: txData.fee,
          total: feeIncluded ? txData.amount : txData.amount + txData.fee,
          inWallet: spendableAmount,
          remaining: 0,
        };

        receipt.remaining = receipt.inWallet - receipt.total;

        return receipt;
      }),
      tap(() => this.receiptLoading = false),
      startWith({} as IReceipt),
    );

  amountFiat$: Observable<number> = this.amountMrt.valueChanges.pipe(
    withLatestFrom(this.selectedCurrency.valueChanges),
    switchMap(([amountMrt, selectedCurrency]) =>
      fromPromise(
        this.rateService.microsToFiat(
          mrtToMicro(amountMrt),
          selectedCurrency.code,
        ),
      ),
    ),
  );

  constructor(
    private store: Store<IRootAppState>,
    private formBuilder: FormBuilder,
    private sendService: SendService,
    private logger: LoggerService,
    private loadingCtrl: LoadingControllerService,
    private toastCtrl: ToastControllerService,
    private rateService: RateService,
  ) {
  }

  async init() {
    this.availableCurrencies = await this.rateService.getAvailableFiats();

    await this.resetFormData();

    this.type.valueChanges.pipe(
      distinctUntilChanged(),
    )
      .subscribe((value: SendMethodType) => {
        if ((value === SendMethodType.Easy && this.address.invalid)
          || (value === SendMethodType.Classic && this.address.valid)) {
          // Re-validate address field to make sure it's marked as valid when necessary
          this.address.updateValueAndValidity({ onlySelf: false });
        }

        if (value === SendMethodType.Classic && this.destination.invalid) {
          this.destination.setValue('');
          this.destination.markAsPristine();
        }
      });

    this.password.valueChanges.subscribe(() => {
      this.passwordConfirm.updateValueAndValidity({ onlySelf: false });
    });

    this.onSubmit$.subscribe();

    this.formData.statusChanges
      .pipe(
        filter(() => this.formData.pristine),
        switchMap(() =>
          this.formData.statusChanges
            .pipe(
              filter(() => !this.formData.pristine),
              take(1),
            ),
        ),
      )
      .subscribe(() => {
        this.easySendUrl = this.easySendDelivered = this.success = void 0;
      });

    // temporary hack
    // TODO(ibby) find a better way to ensure we have an initial value for selected currency
    if (this.selectedCurrency.value) {
      setTimeout(() => {
        this.selectedCurrency.setValue(this.selectedCurrency.value);
      }, 1000);
    }
  }

  onGlobalSendCopy() {
    this.toastCtrl.success('Copied to clipboard');
  }


  selectCurrency(currency) {
    this.selectedCurrency.setValue(currency);
  }

  private async resetFormData() {
    this.formData.reset({ emitEvent: false });

    const wallets = await this.wallets$.pipe(
      skipWhile(wallets => !wallets || !wallets.length),
      take(1),
    ).toPromise();

    this.hasUnlockedWallet = wallets.length > 0;
    this.hasAvailableInvites = wallets.some(w => w.availableInvites > 0);

    if (wallets && wallets[0]) {
      this.wallet.setValue(wallets[0], { emitEvent: false });
      if (wallets[0].balance.spendableAmount <= 0) {
        wallets.some((wallet) => {
          if (wallet.balance.spendableAmount > 0) {
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

    this.formData.markAsPristine();
  }

  selectWallet(wallet) {
    const { value } = this.wallet;
    if (!value || value.id !== wallet.id)
      this.wallet.setValue(wallet);
  }

  private async createTx(formValue: any): Promise<ISendTxData> {
    let { amountMrt, wallet, type, feeIncluded, password, address } = formValue;

    address = cleanAddress(address);

    let micros = mrtToMicro(amountMrt);

    if (micros > wallet.balance.spendableAmount) {
      this.overMaximumAmount = true;
      micros = wallet.balance.spendableAmount;
      amountMrt = microsToMrt(micros);
      this.amountMrt.setValue(amountMrt, { emitEvent: false });
    }

    if (micros == wallet.balance.spendableAmount) {
      feeIncluded = true;
      this.feeIncluded.setValue(true, { emitEvent: false });
    }

    const fee = await this.sendService.estimateFee(wallet.client, micros, type == SendMethodType.Easy, address);

    return {
      amount: micros,
      password,
      fee,
      wallet: wallet.client,
      feeIncluded,
      toAddress: this.address.value || 'MeritMoney link',
    };
  }

  async send(txData: ISendTxData) {
    if (txData.easyFee) {
      txData.txp.amount += txData.easyFee;
    }

    const wallet = txData.wallet;

    txData.sendMethod = { type: this.type.value } as ISendMethod;

    await this.sendService.send(wallet, txData);

    if (txData.sendMethod.type === SendMethodType.Easy) {
      this.easySendUrl = txData.easySendUrl;
      const destination = this.destination.value;
      const destinationType = getSendMethodDestinationType(destination);
      if (destination && destinationType) {
        try {
          await wallet.deliverGlobalSend(txData.easySend, {
            type: SendMethodType.Easy,
            destination: destinationType,
            value: destination,
          });

          this.easySendDelivered = true;
        } catch (err) {
          this.logger.error('Unable to deliver GlobalSend', err);
          this.easySendDelivered = false;
        }
      }
    }

    setTimeout(() => {
      this.store.dispatch(new RefreshOneWalletAction(wallet.id, {
        skipRewards: true,
        skipAlias: true,
        skipShareCode: true,
      }));
    }, 1750);

    return true;
  }

}
