import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WalletService } from '@merit/common/services/wallet.service';
import { RateService } from '@merit/common/services/rate.service';
import { ConfigService } from '@merit/common/services/config.service';
import { Observable } from 'rxjs/Observable';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Store } from '@ngrx/store';
import { SendService } from '@merit/common/services/send.service';
import 'rxjs/add/operator/take';
import { selectWallets, selectWalletsLoading } from '@merit/common/reducers/wallets.reducer';
import { IRootAppState } from '@merit/common/reducers';

@Component({
  selector: 'view-receive',
  templateUrl: './receive.view.html',
  styleUrls: ['./receive.view.sass'],
  encapsulation: ViewEncapsulation.None
})
export class ReceiveView implements OnInit {
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  walletsLoading$: Observable<boolean> = this.store.select(selectWalletsLoading);

  protocolHandler: string = 'merit';
  address: string;
  alias: string;
  qrAddress: string;
  amount: number = 0;
  amountMicros: number;
  availableUnits: Array<string>;
  amountCurrency: string;
  amountInFiat: any = 0;
  walletIcon: string = '/assets/v1/icons/ui/wallets/wallet-ico-grey.svg';
  vaultIcon: string = '/assets/v1/icons/ui/wallets/vault-ico-grey.svg';

  availableCurrencies: any = [
    {
      'name': 'USD',
      'symbol': '$',
      'value': 10
    },
    {
      'name': 'RUB',
      'symbol': '₽',
      'value': 0.1
    },
    {
      'name': 'CAD',
      'symbol': 'C$',
      'value': 2
    },
    {
      'name': 'EUR',
      'symbol': '€',
      'value': 3
    }
  ];

  availableFeesVariants: any = [
    {
      'name': 'I pay the fee',
      'value': 10
    },
    {
      'name': 'Recipient will pay the fee',
      'value': 0
    }
  ];

  selectedFee: any = {
    'name': 'I pay the fee',
    'value': 10
  };

  // For now, the first wallet in the list of wallets is the default.
  // TODO(AW): Let's add a setting where the user can choose their default wallet.
  selectedWallet: DisplayWallet;

  selectedCurrency: any = {
    'name': 'USD',
    'symbol': '$',
    'value': 10
  };

  constructor(private configService: ConfigService,
              private store: Store<IRootAppState>,
              private walletService: WalletService,
              private sendService: SendService,
              private rateService: RateService) {
    try {
      this.availableUnits = [
        this.configService.get().wallet.settings.unitCode.toUpperCase(),
        this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase()
      ];
    } catch (err) {
      console.log('Error reading the config service.');
      console.log(err);
    }
  }

  async ngOnInit() {
    try {
      this.selectedWallet = (await this.wallets$.take(1).toPromise())[0];
      this.address = this.selectedWallet.client.getRootAddress().toString();
      let info = await this.sendService.getAddressInfo(this.address);
      this.alias = info.alias;
      this.formatAddress();
    } catch (err) {
      if (err.text)
      //this.error = err.text;
        console.log('Could not initialize: ', err.text);
      // return this.toastCtrl.create({
      //   message: err.text || 'Failed to generate new address',
      //   cssClass: ToastConfig.CLASS_ERROR
      // }).present();
    }
  }

  selectCurrency($event) {
    this.selectedCurrency = $event;
    this.amountInFiat = `${$event.symbol} ${this.amount * $event.value}`;
  }

  selectFee($event) {
    this.selectedFee = $event;
  }

  selectWallet($event) {
    this.selectedWallet = $event;
  }

  changeAmount(event: any) {
    this.amount = event.target.value;
    let currency = this.selectedCurrency;

    this.amountMicros = this.rateService.mrtToMicro(this.amount);
    this.amountInFiat = `${currency.symbol} ${this.amount * currency.value}`;
    this.formatAddress();
  }

  private formatAddress() {
    this.qrAddress = `${ this.protocolHandler }:${ this.address }${ this.amountMicros ? '?micros=' + this.amountMicros : '' }`;
  }
}
