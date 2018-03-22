import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { getEasySendURL } from '@merit/common/models/easy-send';
import { SendMethodType } from '@merit/common/models/send-method';
import { IRootAppState } from '@merit/common/reducers';
import { selectWallets } from '@merit/common/reducers/wallets.reducer';
import { ConfigService } from '@merit/common/services/config.service';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { FeeService } from '@merit/common/services/fee.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { RateService } from '@merit/common/services/rate.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { defer } from 'rxjs/observable/defer';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';
import { catchError, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/debounceTime';

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

  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
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

  constructor(private route: ActivatedRoute,
              private store: Store<IRootAppState>,
              private formBuilder: FormBuilder,
              private feeService: FeeService,
              private logger: LoggerService,
              private rateService: RateService,
              private easySendService: EasySendService,
              private txFormatService: TxFormatService,
              private configService: ConfigService,
              private walletService: WalletService) {
  }

  async ngOnInit() {
    const wallets = await this.wallets$.take(1).toPromise();
    this.hasUnlockedWallet = wallets.some((wallet: DisplayWallet) => wallet.status.confirmed);
    this.selectedWallet = (await this.wallets$.take(1).toPromise())[0];

    const { wallet: { settings: walletSettings } } = this.configService.get();

    this.availableUnits = [
      { type: CURRENCY_TYPE_MRT, name: walletSettings.unitCode.toUpperCase() }
    ];
    if (this.rateService.getRate(walletSettings.alternativeIsoCode) > 0) {
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

  setType(type: SendMethodType) {
    this.formData.get('type').setValue(type);
  }

  getType(): SendMethodType {
    return this.formData.get('type').value;
  }

  async send() {
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

  private approveTx() {
    if (!this.txData.wallet.canSign() && !this.txData.wallet.isPrivKeyExternal()) {
      this.logger.info('No signing proposal: No private key');
      return this.walletService.onlyPublish(this.txData.wallet, this.txData.txp);
    } else {
      return this.walletService.publishAndSign(this.txData.wallet, this.txData.txp);
    }
  }

  private async getEasyData() {
    const { type, password } = this.formData.getRawValue();

    if (type != SendMethodType.Easy) {
      return {};
    } else {
      const easySend = await this.easySendService.createEasySendScriptHash(this.selectedWallet.client, password);

      easySend.script.isOutput = true;

      return {
        script: easySend.script,
        scriptAddress: easySend.scriptAddress,
        scriptReferralOpts: easySend.scriptReferralOpts,
        url: getEasySendURL(easySend)
      };
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

  private async createTxp(formattedAmount: any, dryRun?: boolean) {

    const { type, toAddress, amount, feeIncluded } = this.formData.getRawValue();
    const txData: any = {};

    if (this.selectedWallet.client.status.spendableAmount == 0)
      throw 'Insufficient funds';

    try {

      let data: any = {
        toAddress: type === 'classic' ? toAddress : '',
        toName: '',
        toAmount: parseInt(formattedAmount.micros),
        allowSpendUnconfirmed: true,
        feeLevel: 'superEconomy'
      };

      const maxAmount = this.selectedWallet.client.status.spendableAmount;

      console.log(formattedAmount.micros, maxAmount);

      if (formattedAmount.micros > maxAmount) {
        this.formData.get('amount').setValue(this.txFormatService.satToUnit(maxAmount));
        this.formData.get('feeIncluded').setValue(true);
        return void 0;
      } else if (formattedAmount.micros == maxAmount) {
        if (feeIncluded) {
          console.log('Sending max');
          data.sendMax = true;
          data.toAmount = null;
        } else {
          console.log('Sending max but fee isnt included, lets update form data');
          this.formData.get('feeIncluded').setValue(true);
          return void 0;
        }
      }

      const easyData: any = await this.getEasyData();

      data = data || {};
      data = {
        ...data,
        ..._.pick(easyData, 'script', 'toAddress'),
        toAddress: easyData.scriptAddress || data.toAddress || this.selectedWallet.referrerAddress
      };

      const txpOut = await this.getTxp(_.clone(data), this.selectedWallet.client, dryRun);


      txData.txp = txpOut;
      txData.easySend = easyData;
      txData.easySendUrl = easyData.url;
      this.referralsToSign = _.filter([easyData.scriptReferralOpts]);

      const level = {
        level: 'superEconomy',
        feePerKb: 20000,
        nbBlocks: 24
      };

      let micros = Math.round(txpOut.estimatedSize * level.feePerKb / 1000);
      let mrt = Math.round(this.rateService.microsToMrt(micros) * 1000000000) / 1000000000;
      let percent = this.formData.get('feeIncluded') ? (micros / (amount.micros) * 100) : (micros / (amount.micros + micros) * 100);
      let precision = 1;
      if (percent > 0) {
        while (percent * Math.pow(10, precision) < 1) {
          precision++;
        }
      }
      precision++; //showing two valued digits

      let fee = {
        description: level.level,
        name: level.level,
        minutes: level.nbBlocks * MINUTE_PER_BLOCK,
        micros: micros,
        mrt: mrt,
        feePerKb: level.feePerKb,
        percent: percent.toFixed(precision) + '%'
      };

      txData.txp.availableFeeLevels = [fee];

      // todo IF EASY ADD  easySend.size*feeLevel.feePerKb !!!!!!
      txData.txp.fee = txData.feeAmount = fee.micros;

      txData.wallet = this.selectedWallet.client;

      return txData;
    } catch (err) {
      txData.txp = null;
      this.logger.warn(err);

      if (err.message) {
        throw new Error(err.message);
      }

      this.selectedFee = null;
      // TODO display error to user
    }
  }

  private async getTxp(tx: any, wallet: MeritWalletClient, dryRun?: boolean) {
    // ToDo: use a credential's (or fc's) function for this
    if (tx.description && !wallet.credentials.sharedEncryptingKey) {
      throw new Error('Need a shared encryption key to add message!');
    }

    if (tx.toAmount > Number.MAX_SAFE_INTEGER) {
      throw new Error('The amount is too big');
    }

    let txp: any = {};

    if (tx.script) {
      txp.outputs = [{
        'script': tx.script.toHex(),
        'toAddress': tx.toAddress,
        'amount': tx.toAmount,
        'message': tx.description
      }];
      txp.addressType = 'P2SH';
    } else {
      txp.outputs = [{
        'toAddress': tx.toAddress,
        'amount': tx.toAmount,
        'message': tx.description
      }];
    }

    txp.sendMax = tx.sendMax;

    if (tx.sendMaxInfo) {
      txp.inputs = tx.sendMaxInfo.inputs;
      txp.fee = tx.sendMaxInfo.fee;
    } else {
      txp.feeLevel = 'superEconomy';
    }

    txp.message = tx.description;

    if (tx.paypro) {
      txp.payProUrl = tx.paypro.url;
    }
    txp.excludeUnconfirmedUtxos = !tx.allowSpendUnconfirmed;
    if (!dryRun) {
      txp.dryRun = dryRun;
      txp.fee = tx.feeAmount;
      txp.inputs = tx.txp.inputs;
      if (txp.sendMax || this.formData.get('feeIncluded').value) {
        txp.sendMax = false; // removing senmax options because we are setting fee and amount values manually
        txp.outputs[0].amount = this.txData.amount - this.txData.feeAmount;
      } else {
        txp.outputs[0].amount = this.txData.amount;
      }
    }

    return wallet.createTxProposal(txp);
  }

}
