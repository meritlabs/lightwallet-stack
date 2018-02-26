import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {

  availableCurrencies: string[] = [
    'USD',
    'RUB',
    'CAD',
    'EUR'
  ];

  selectedCurrency: string = 'USD';

  constructor() { }

  ngOnInit() {
  }

  selectCurrency(currency: string) {
    this.selectedCurrency = currency;
  }

}
