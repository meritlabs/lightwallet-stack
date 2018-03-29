import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { getEasySendURL } from '@merit/common/models/easy-send';
import { SendMethodType } from '@merit/common/models/send-method';
import { IRootAppState } from '@merit/common/reducers';
import { selectConfirmedWallets } from '@merit/common/reducers/wallets.reducer';
import { ConfigService } from '@merit/common/services/config.service';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { FeeService } from '@merit/common/services/fee.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { RateService } from '@merit/common/services/rate.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { isWalletEncrypted } from '@merit/common/utils/wallet';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';
import { catchError, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { AddressService } from '@merit/common/services/address.service';
import { debounce } from 'lodash';

const CURRENCY_TYPE_MRT = 'mrt';
const CURRENCY_TYPE_FIAT = 'fiat';

const MINUTE_PER_BLOCK = 1;

interface ISendReceipt {
  loading: boolean;
  amount: number;
  fees: number;
  total: number;
  inWallet: number;
  totalRemaining: number;
}

@Component({
  selector: 'view-send',
  templateUrl: './send.view.html',
  styleUrls: ['./send.view.sass'],
  encapsulation: ViewEncapsulation.None
})
export class SendView implements OnInit {
  availableCurrencies: any = [
    {
      'name': 'USD',
      'symbol': '$',
      'value': 10
    },
    {
      'name': 'RUB',
      'symbol': 'R',
      'value': 0.1
    },
    {
      'name': 'CAD',
      'symbol': 'C$',
      'value': 2
    },
    {
      'name': 'EUR',
      'symbol': 'E',
      'value': 3
    }
  ];

  selectedWallet: DisplayWallet;
  selectedFee: any;

  fiatAmount: any = 0;
  meritAmount: number = 0;

  selectedCurrency: any = {
    'name': 'USD',
    'symbol': '$',
    'value': 10
  };

  wallets$: Observable<DisplayWallet[]> = this.store.select(selectConfirmedWallets);
  hasUnlockedWallet: boolean;

  formData: FormGroup = this.formBuilder.group({
    amount: [0],
    toAddress: [''],
    type: 'classic',
    feeIncluded: false,
    selectedWallet: ''
  });

  availableUnits: Array<{ type: string, name: string }>;

  easySendUrl: string;

  error: string;

  receipt$: Observable<Partial<ISendReceipt>> = merge(
    defer(() => of(this.formData.getRawValue())),
    this.formData.valueChanges.debounceTime(500)
  )
    .pipe(
      distinctUntilChanged(),
      switchMap((formData: any) => {
        if (!formData.amount || formData.amount == 0) {
          return of({
            amount: 0,
            fee: 0,
            total: 0
          });
        }

        return merge(
          of({
            loading: true
          }),
          fromPromise(this.updateAmount(formData))
            .pipe(
              switchMap((formattedAmount: any) =>
                fromPromise(this.createTxp(formattedAmount, true))
              ),
              map((txData: any) => {
                if (txData) {
                  this.txData = txData;
                  console.log('Tx data is ', txData);
                  this.error = void 0;
                  return {
                    amount: txData.txp.amount,
                    fee: txData.feeAmount,
                    total: txData.txp.amount + txData.feeAmount
                  };
                } else {
                  throw void 0;
                }
              }),
              catchError((err) => {
                if (err) {
                  this.error = err;
                }

                return of(<Partial<ISendReceipt>>{
                  amount: 0,
                  fee: 0,
                  total: 0
                });
              })
            )
        );
      }),
      catchError(err => {
        this.error = err;

        return of({
          amount: 0,
          fee: 0,
          total: 0
        });
      })
    );

  private referralsToSign: any[];
  private txData: any;

  private fiatAmountAvailable: boolean;

  constructor(private route: ActivatedRoute,
              private store: Store<IRootAppState>,
              private formBuilder: FormBuilder,
              private feeService: FeeService,
              private logger: LoggerService,
              private rateService: RateService,
              private easySendService: EasySendService,
              private txFormatService: TxFormatService,
              private configService: ConfigService,
              private walletService: WalletService,
              private passwordPromptCtrl: PasswordPromptController,
              private addressService: AddressService
  ) {
  }

  async ngOnInit() {
    const wallets = await this.wallets$.take(1).toPromise();

    this.hasUnlockedWallet = wallets.length > 0;
    this.selectedWallet = (await this.wallets$.take(1).toPromise())[0];


    const { wallet: { settings: walletSettings } } = this.configService.get();

    this.availableUnits = [
      { type: CURRENCY_TYPE_MRT, name: walletSettings.unitCode.toUpperCase() }
    ];
    if (this.rateService.getRate(walletSettings.alternativeIsoCode) > 0) {
      this.fiatAmountAvailable = true;
      this.availableUnits.push({
        type: CURRENCY_TYPE_FIAT,
        name: walletSettings.alternativeIsoCode.toUpperCase()
      });
    }

    const amountControl = this.formData.get('amount');
    amountControl.valueChanges.subscribe(this.onAmountChange.bind(this));

    const { amount } = await this.route.queryParams.take(1).toPromise();

    if (amount) {
      amountControl.setValue(amount);
      this.meritAmount = amount;
      this.updateFiatAmount();
    }
  }

  selectCurrency($event) {
    this.selectedCurrency = $event;
    this.updateFiatAmount();
  }

  updateFiatAmount() {
    this.fiatAmount = `${this.selectedCurrency.symbol} ${this.meritAmount * this.selectedCurrency.value}`;
  }

  selectWallet(wallet: DisplayWallet) {
    this.selectedWallet = wallet;
  }

  onAmountChange(amount: number) {
    this.meritAmount = amount;
    this.updateFiatAmount();
  }

  onAddressChange(input: string) {
    input =  input.replace(/\s+/g, '');
    if (input.charAt(0) == '@') input = input.slice(1);

    if (!input) {
      return this.debounceValidateInput.cancel();
    }

    this.error = '';
    this.debounceValidateInput(input);
  }

  private debounceValidateInput = _.debounce((input) => this.validateInput(input), 300);

  async validateInput(input) {
    if (this.addressService.couldBeAlias(input) || this.addressService.isAddress(input)) {
      let addressInfo = await this.addressService.getAddressInfo(input);
      if (!addressInfo.isConfirmed) this.error = 'Address not confirmed';
    } else {
      this.error = 'Alias/address not found';
    }
  }


  setType(type: SendMethodType) {
    this.formData.get('type').setValue(type);
  }

  getType(): SendMethodType {
    return this.formData.get('type').value;
  }

  async send() {
    if (isWalletEncrypted(this.txData.wallet)) {
      // wallet is encrypted, we need to decrypt it before sending
      if (!await new Promise<boolean>((resolve) => {
          const passwordPrompt = this.passwordPromptCtrl.create(this.txData.wallet);
          passwordPrompt.onDismiss((password: string) => {
            if (password) {
              this.walletService.decrypt(this.txData.wallet.client, password);
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }))
        return;
    }

    console.log('Sending...');
    // TODO: show loading popup
    try {
      if (this.referralsToSign && this.referralsToSign.length) {
        console.log('Signing referrals...', this.referralsToSign);
        await Promise.all(this.referralsToSign.map(ref => this.txData.wallet.sendReferral(ref)));
        console.log('Sent referrals...');
        await Promise.all(this.referralsToSign.map(referral => {
          return this.txData.wallet.sendInvite(referral.address, 1);
        }));
        console.log('Sent invites... ');
      }

      console.log('Approving tx');
      await this.approveTx();

      if (this.getType() == SendMethodType.Easy) {
        // TODO(ibby): handle easy-send
        await this.easySendService.storeEasySend(this.txData.wallet.id, this.txData.easySend);
        this.easySendUrl = this.txData.easySendUrl;
        console.log(this.txData.easySendUrl);
      }

      console.log('Done sending!');

      // TODO: Show a toast telling the user that the transaction was successful
      // TODO: Redirect the user to the wallet history page
    } catch (err) {
      this.logger.warn(err);
      // TODO: display error to user
    } finally {
      // TODO: dismiss the loading dialog
    }
  }

  private async updateAmount(formData: any) {
    const amount: any = {};

    amount.mrt = parseFloat(formData.amount) || 0;
    amount.micros = this.rateService.mrtToMicro(amount.mrt);
    if (this.availableUnits[1]) {
      amount.fiat = this.rateService.fromMicrosToFiat(amount.micros, this.availableUnits[1].name);
    }
    amount.mrtStr = this.txFormatService.formatAmountStr(amount.micros) + ' MRT';
    amount.fiatStr = await this.txFormatService.formatAlternativeStr(amount.micros);

    console.log('Amount is ', amount);

    return amount;
  }


}
