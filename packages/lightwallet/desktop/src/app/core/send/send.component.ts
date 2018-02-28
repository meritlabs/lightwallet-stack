import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'view-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class SendComponent implements OnInit {
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

  selectedCurrency:any = {
    "name": 'USD',
    "symbol": '$',
    "value": 10
  };
  converted: any;
  amount: number = 0;
  constructor() { }

  ngOnInit() {
  }

  receiveSelection($event) {
    var currency = this.selectedCurrency;
    this.selectedCurrency = $event
    this.converted = `${currency.symbol} ${this.amount * currency.value}`;
  }
  onKey(event: any) {
    var currency = this.selectedCurrency;
    this.amount = event.target.value;
    this.converted = `${currency.symbol} ${this.amount * currency.value}`;
  }

}
