import { Component, ViewEncapsulation } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { selectWallets, selectWalletsLoading } from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'view-wallets',
  templateUrl: './wallets.view.html',
  styleUrls: ['./wallets.view.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class WalletsView {
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  walletsLoading$: Observable<boolean> = this.store.select(selectWalletsLoading);

  constructor(private store: Store<IRootAppState>, private router: Router) {}

  ngOnInit() {
    return this.wallets$
      .pipe(
        take(1),
        tap(wallets => {
          if (wallets.length === 1) {
            this.router.navigate(['/wallets/', wallets[0].id]);
          }
        }),
      )
      .toPromise();
  }
}
