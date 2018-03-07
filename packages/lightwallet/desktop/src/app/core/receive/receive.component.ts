import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProfileService } from '@merit/common/services/profile.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { RateService } from '@merit/common/services/rate.service';
import { ConfigService } from '@merit/common/services/config.service';
import { MWCErrors } from '@merit/common/merit-wallet-client/lib/errors';
import { Observable } from 'rxjs/Observable';
import { getWalletsLoading, getWallets, IAppState } from '@merit/common/reducers';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Store } from '@ngrx/store';
import { SendService } from '@merit/common/services/send.service';



@Component({
  selector: 'view-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class ReceiveComponent implements OnInit {
  wallets$: Observable<DisplayWallet[]> = this.store.select(getWallets);
  walletsLoading$: Observable<boolean> = this.store.select(getWalletsLoading);

  protocolHandler: string = "merit";
  address: string;
  alias: string;
  qrAddress: string;
  amount: number = 0;
  amountMicros: number;
  availableUnits: Array<string>;
  amountCurrency: string;
  converted: any = 0;

  availableCurrencies: any = [
    {
      "name": 'USD',
      "symbol": '$',
      "value": 10
    },
    {
      "name": 'RUB',
      "symbol": '₽',
      "value": 0.1
    },
    {
      "name": 'CAD',
      "symbol": 'C$',
      "value": 2
    },
    {
      "name": 'EUR',
      "symbol": '€',
      "value": 3
    }
  ];
  availableFeesVariants: any = [
    {
      "name": 'I pay the fee',
      "value": 10
    },
    {
      "name": 'Recipient will pay the fee',
      "value": 0
    }
  ];
  selectedFee:any = {
    "name": 'I pay the fee',
    "value": 10
  };
  previouslyAvailableWallets: any = [
    {
      "name": 'Personal Wallet',
      "value": 10,
      "icon": "/assets/v1/icons/ui/wallets/wallet-ico-grey.svg"
    },
    {
      "name": 'Reserve Wallet',
      "value": 200,
      "icon": "/assets/v1/icons/ui/wallets/wallet-ico-grey.svg"
    },
    {
      "name": 'Pension Savings',
      "value": 200,
      "icon": "/assets/v1/icons/ui/wallets/vault-ico-grey.svg"
    }
  ];

  // For now, the first wallet in the list of wallets is the default. 
  // TODO(AW): Let's add a setting where the user can choose their default wallet.
  selectedWallet:DisplayWallet = this.wallets$[0];

  selectedCurrency: any = {
    "name": 'USD',
    "symbol": '$',
    "value": 10
  };
  constructor(
    private configService: ConfigService,
    private store: Store<IAppState>,
    private walletService: WalletService,
    private sendService: SendService    
  ) {
    try {
      this.availableUnits = [
        this.configService.get().wallet.settings.unitCode.toUpperCase(),
        this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase()
      ];
    } catch (err) {
      console.log("Error reading the config service.");
      console.log(err);
    }
  }

  async ngOnInit() {
    try {
      this.address = this.walletService.getRootAddress(this.selectedWallet).toString();
      let info = await this.sendService.getAddressInfo(this.address);
      this.alias = info.alias;
      this.formatAddress();
    } catch (err) {
      if (err.text)
        this.error = err.text;
        console.log("Could not initialize: ", err.text);
      // return this.toastCtrl.create({
      //   message: err.text || 'Failed to generate new address',
      //   cssClass: ToastConfig.CLASS_ERROR
      // }).present();
    }

  }
  selectCurrency($event) {
    this.selectedCurrency = $event;
    this.converted = `${$event.symbol} ${this.amount * $event.value}`;
  }
  selectFee($event) {
    this.selectedFee = $event
  }
  selectWallet($event) {
    this.selectedWallet = $event
  }
  onKey(event: any) {
    let currency = this.selectedCurrency;
    this.amount = event.target.value;
    this.converted = `${currency.symbol} ${this.amount * currency.value}`;
  }

  private formatAddress() {
    this.qrAddress = `${ this.protocolHandler }:${ this.address }${ this.amountMicros ? '?micros=' + this.amountMicros : '' }`;
  }
}
