import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { selectConfirmedWallets, selectWalletsLoading } from '@merit/common/reducers/wallets.reducer';
import { AddressService } from '@merit/common/services/address.service';
import { ConfigService } from '@merit/common/services/config.service';
import { RateService } from '@merit/common/services/rate.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'view-receive',
  templateUrl: './receive.view.html',
  styleUrls: ['./receive.view.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class ReceiveView implements OnInit {
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectConfirmedWallets);
  walletsLoading$: Observable<boolean> = this.store.select(selectWalletsLoading);

  hasUnlockedWallet: boolean;

  protocolHandler: string = 'merit';
  address: string;
  alias: string;
  qrAddress: string;
  amount?: number = null;
  amountMicros: number;
  availableUnits: Array<string>;
  amountCurrency: string;
  amountInFiat: any = 0;

  availableCurrencies: any = [
    {
      name: 'USD',
      symbol: '$',
      value: 10,
    },
    {
      name: 'RUB',
      symbol: '₽',
      value: 0.1,
    },
    {
      name: 'CAD',
      symbol: 'C$',
      value: 2,
    },
    {
      name: 'EUR',
      symbol: '€',
      value: 3,
    },
  ];

  // For now, the first wallet in the list of wallets is the default.
  // TODO(AW): Let's add a setting where the user can choose their default wallet.
  selectedWallet: DisplayWallet;

  selectedCurrency: any = {
    name: 'USD',
    symbol: '$',
    value: 10,
  };

  constructor(
    private configService: ConfigService,
    private store: Store<IRootAppState>,
    private walletService: WalletService,
    private addressService: AddressService,
    private rateService: RateService,
    private toastCtrl: ToastControllerService,
  ) {
    try {
      this.availableUnits = [
        this.configService.get().wallet.settings.unitCode.toUpperCase(),
        this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase(),
      ];
    } catch (err) {
      console.error('Error reading the config service.');
      console.error(err);
    }
  }

  async ngOnInit() {
    try {
      const wallets = await this.wallets$.take(1).toPromise();
      this.hasUnlockedWallet = wallets.length > 0;
      this.selectWallet(wallets[0]);
    } catch (err) {
      if (err.text) console.error('Could not initialize: ', err.text);
    }
  }

  onCopy() {
    this.toastCtrl.success('Copied to clipboard!');
  }

  selectCurrency($event) {
    this.selectedCurrency = $event;
    this.amountInFiat = `${$event.symbol} ${this.amount * $event.value}`;
  }

  async selectWallet(wallet: DisplayWallet) {
    if (!wallet) return;

    this.selectedWallet = wallet;
    this.changeAmount();
    this.address = this.selectedWallet.client.getRootAddress().toString();
    let info = await this.addressService.getAddressInfo(this.address);
    this.alias = info.alias;
    this.formatAddress();
  }

  changeAmount() {
    let currency = this.selectedCurrency;

    this.amountMicros = this.rateService.mrtToMicro(this.amount);
    this.amountInFiat = `${currency.symbol} ${this.amount * currency.value}`;
    this.formatAddress();
  }

  private formatAddress() {
    this.qrAddress = `${this.protocolHandler}:${this.address}${
      this.amountMicros ? '?micros=' + this.amountMicros : ''
    }`;
  }
}
