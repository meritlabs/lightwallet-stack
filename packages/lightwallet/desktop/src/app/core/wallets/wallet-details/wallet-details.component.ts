import { Component, OnInit } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { getWalletById } from '@merit/common/reducers/wallets.reducer';

@Component({
  selector: 'view-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.sass']
})
export class WalletDetailComponent {
  wallet$: Observable<DisplayWallet> = this.route.params
    .pipe(
      switchMap(({ id }) =>
        this.store.select(getWalletById(id))
      )
    );

  constructor(private store: Store<IRootAppState>,
              private route: ActivatedRoute) {}
}
