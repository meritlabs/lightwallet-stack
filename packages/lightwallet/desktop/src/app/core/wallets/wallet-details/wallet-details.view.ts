import { Component, OnInit } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { selectWalletById, selectNumberOfWallets } from '@merit/common/reducers/wallets.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'view-wallet-details',
  templateUrl: './wallet-details.view.html',
  styleUrls: ['./wallet-details.view.sass']
})
export class WalletDetailView {
  singleWallet$: Observable<boolean> = this.store.select(selectNumberOfWallets).pipe(
    map((numOfWallets: number) => numOfWallets === 1)
  );
  wallet$: Observable<DisplayWallet> = this.route.params
    .pipe(
    switchMap(({ id }) =>
      this.store.select(selectWalletById(id))
    )
    );

  constructor(private store: Store<IRootAppState>,
    private route: ActivatedRoute) { }
}
