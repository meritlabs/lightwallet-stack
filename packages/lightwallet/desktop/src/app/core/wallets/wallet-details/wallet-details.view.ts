import { Component, OnInit } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { selectWalletById } from '@merit/common/reducers/wallets.reducer';

@Component({
  selector: 'view-wallet-details',
  templateUrl: './wallet-details.view.html',
  styleUrls: ['./wallet-details.view.sass']
})
export class WalletDetailView {
  showAddNewWalletButtons: boolean = false;
  wallet$: Observable<DisplayWallet> = this.route.params
    .pipe(
      switchMap(({ id }) =>
        this.store.select(selectWalletById(id))
      )
    );

  constructor(private store: Store<IRootAppState>,
              private route: ActivatedRoute) {}
  ngOnInit() {
    if("singleWallet" in localStorage && localStorage.getItem("singleWallet") === 'true') {
      this.showAddNewWalletButtons = true;
    }
  }
}
