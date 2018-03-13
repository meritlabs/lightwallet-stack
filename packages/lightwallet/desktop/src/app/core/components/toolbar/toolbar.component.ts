import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {

  availableCurrencies: any = [
    {
      "name": 'USD',
      "symbol": '$',
      "value": '1'
    },
    {
      "name": 'RUB',
      "symbol": 'R',
      "value": '0.1'
    },
    {
      "name": 'CAD',
      "symbol": 'R',
      "value": '2'
    },
    {
      "name": 'EUR',
      "symbol": 'R',
      "value": '3'
    }
  ];

  selectedCurrency: any = {
    "name": 'USD',
    "symbol": '$',
    "value": '1'
  };

  constructor() {}
  ngOnInit() {}
  receiveSelection($event) {
    this.selectedCurrency = $event
  }

}
