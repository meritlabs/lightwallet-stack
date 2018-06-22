import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IDisplayTransaction, Visited } from '@merit/common/models/transaction';
import { IRootAppState } from '@merit/common/reducers';
import { selectTransactions, selectTransactionsLoading } from '@merit/common/reducers/transactions.reducer';
import { selectWallets, selectWalletsLoading, selectWalletTotals } from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';
import { isArray } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Component({
  selector: 'view-dashboard',
  templateUrl: './dashboard.view.html',
  styleUrls: ['./dashboard.view.sass'],
})
export class DashboardView {
  showGuide: boolean = !(
    'hideWalletWelcomeWindow' in localStorage && localStorage.getItem('hideWalletWelcomeWindow') === 'true'
  );
  amount: number = null;
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  walletsLoading$: Observable<boolean> = this.store.select(selectWalletsLoading);
  totals$: Observable<any> = this.store.select(selectWalletTotals);
  transactions$: Observable<IDisplayTransaction[]> = this.store
    .select(selectTransactions)
    .pipe(map((transactions: IDisplayTransaction[]) => (isArray(transactions) ? transactions.slice(0, 5) : [])));
  transactionsLoading$: Observable<boolean> = this.store.select(selectTransactionsLoading);
  visited: Visited[] = [];

  constructor(private store: Store<IRootAppState>, private sanitizer: DomSanitizer) { }

  getHistoryStyle(length: number) {
    return this.sanitizer.bypassSecurityTrustStyle('height: ' + length * 110 + 'px');
  }

  sendSubmit($event) {
    if ($event.keyCode === 13) {
      let element: HTMLElement = document.getElementById('sendMrt') as HTMLElement;
      element.click();
    }
  }

  ngOnInit() {
    this.transactions$ = this.syncTransactions(this.transactions$);
  }

  private syncTransactions(transactions: Observable<IDisplayTransaction[]>): Observable<IDisplayTransaction[]> {
    // debugger

    this.visited = JSON.parse(localStorage.getItem('lstVisited'));

    if (this.visited == null) {
      //save first time
      transactions
        .subscribe((lstTrans) => {
          this.visited=[];
          lstTrans.forEach(item => {
            const vis = new Visited(item.time, false);
            this.visited.push(vis);
          });
          
          console.log('break');
          lstTrans.forEach(item => {
            localStorage.setItem('lstVisited', JSON.stringify(this.visited));
          });
        });
    } else {
      // compare the list find witch item is new 
      transactions
        .subscribe((lstTrans) => {
          lstTrans.forEach(item => {
            var isVis = true;
            this.visited.forEach(itemVisited => {
              if (item.time == itemVisited.time) {
                console.log('Item already seen');
                isVis=false;
                return;
              }
            });
            item.isNew = isVis;


          });
        });
    }
    
    return transactions;
  }
}
