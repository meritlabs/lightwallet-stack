import { Component, ViewEncapsulation } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import {
  INotification,
  selectNotifications,
  selectTotalUnreadNotifications,
} from '@merit/common/reducers/notifications.reducer';
import {
  RefreshWalletsAction,
  selectWalletsLoading,
  selectWalletTotals,
  selectWalletTotalsLoading,
} from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass'],
})
export class ToolbarComponent {
  showMenu: boolean = false;

  availableCurrencies: any = [
    {
      name: 'USD',
      symbol: '$',
      value: '1',
    },
    {
      name: 'RUB',
      symbol: 'R',
      value: '0.1',
    },
    {
      name: 'CAD',
      symbol: 'R',
      value: '2',
    },
    {
      name: 'EUR',
      symbol: 'R',
      value: '3',
    },
  ];

  selectedCurrency: any = {
    name: 'USD',
    symbol: '$',
    value: '1',
  };

  totals$: Observable<any> = this.store.select(selectWalletTotals);
  totalsLoading$: Observable<any> = this.store.select(selectWalletTotalsLoading);

  notifications$: Observable<INotification[]> = this.store.select(selectNotifications);
  totalUnreadNotifications$: Observable<number> = this.store.select(selectTotalUnreadNotifications);

  walletsLoading$: Observable<boolean> = this.store.select(selectWalletsLoading);

  constructor(private store: Store<IRootAppState>) {}

  receiveSelection($event) {
    this.selectedCurrency = $event;
  }

  refresh() {
    this.store.dispatch(new RefreshWalletsAction());
  }
}
