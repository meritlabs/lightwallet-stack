import { Component, OnInit } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { selectWalletById } from '@merit/common/reducers/wallets.reducer';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';

@Component({
  selector: 'view-wallet-details',
  templateUrl: './wallet-details.view.html',
  styleUrls: ['./wallet-details.view.sass']
})
export class WalletDetailView {
  singleWallet$: any = this.persistenceService.getViewSettings('singleWallet');
  wallet$: Observable<DisplayWallet> = this.route.params
    .pipe(
      switchMap(({ id }) =>
        this.store.select(selectWalletById(id))
      )
    );

  constructor(private store: Store<IRootAppState>,
              private route: ActivatedRoute,
              private persistenceService: PersistenceService2) {}
}
