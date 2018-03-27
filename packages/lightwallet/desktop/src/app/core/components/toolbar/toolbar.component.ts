import { Component, ViewEncapsulation } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { selectWalletTotals, selectWalletTotalsLoading } from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent {

  availableCurrencies: any = [
    {
      'name': 'USD',
      'symbol': '$',
      'value': '1'
    },
    {
      'name': 'RUB',
      'symbol': 'R',
      'value': '0.1'
    },
    {
      'name': 'CAD',
      'symbol': 'R',
      'value': '2'
    },
    {
      'name': 'EUR',
      'symbol': 'R',
      'value': '3'
    }
  ];

  selectedCurrency: any = {
    'name': 'USD',
    'symbol': '$',
    'value': '1'
  };

  totals$: Observable<any> = this.store.select(selectWalletTotals);
  totalsLoading$: Observable<any> = this.store.select(selectWalletTotalsLoading);

  constructor(private store: Store<IRootAppState>) {}

  receiveSelection($event) {
    this.selectedCurrency = $event;
  }
}
