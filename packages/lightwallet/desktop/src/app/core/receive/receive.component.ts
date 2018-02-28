import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'view-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class ReceiveComponent implements OnInit {
  availableCurrencies: any = [
    {
      "name": 'USD',
      "symbol": '$',
      "value": 10
    },
    {
      "name": 'RUB',
      "symbol": 'R',
      "value": 0.1
    },
    {
      "name": 'CAD',
      "symbol": 'C',
      "value": 2
    },
    {
      "name": 'EUR',
      "symbol": 'E',
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
  converted: any = 0;
  amount: number = 0;
  selectedCurrency: any = {
    "name": 'USD',
    "symbol": '$',
    "value": 10
  };
  constructor() {}

  ngOnInit() {}
  selectCurrency($event) {
    this.selectedCurrency = $event
    this.converted = `${$event.symbol} ${this.amount * $event.value}`;
  }
  selectFee($event) {
    this.selectedFee = $event
  }
  selectWallet($event) {
    this.selectedWallet = $event
  }
  onKey(event: any) {
    var currency = this.selectedCurrency;
    this.amount = event.target.value;
    this.converted = `${currency.symbol} ${this.amount * currency.value}`;
  }

}
