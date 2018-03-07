import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProfileService } from '@merit/common/services/profile.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { RateService } from '@merit/common/services/rate.service';
import { ConfigService } from '@merit/common/services/config.service';
import { MWCErrors } from '@merit/common/merit-wallet-client/lib/errors';


@Component({
  selector: 'view-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class ReceiveComponent implements OnInit {
  protocolHandler: string;
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
  availableWallets: any = [
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
  selectedWallet:any = {
    "name": 'Personal Wallet',
    "value": 10,
    "icon": "/assets/v1/icons/ui/wallets/wallet-ico-grey.svg"
  };

  selectedCurrency: any = {
    "name": 'USD',
    "symbol": '$',
    "value": 10
  };
  constructor(
    private configService: ConfigService,
    
  ) {
    this.availableUnits = [
      this.configService.get().wallet.settings.unitCode.toUpperCase(),
      this.configService.get().wallet.settings.alternativeIsoCode.toUpperCase()
    ];
  }

  ngOnInit() {}
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

}
