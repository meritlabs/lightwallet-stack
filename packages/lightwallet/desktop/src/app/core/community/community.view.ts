import { Component } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {
  selectInviteRequests,
  selectInvites,
  selectWallets,
  selectWalletsLoading,
  selectWalletTotals,
} from '@merit/common/reducers/wallets.reducer';
import { IRootAppState } from '@merit/common/reducers';

@Component({
  selector: 'view-network',
  templateUrl: './community.view.html',
  styleUrls: ['./community.view.sass'],
})
export class CommunityView {
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  walletsLoading$: Observable<boolean> = this.store.select(selectWalletsLoading);
  totals$: Observable<any> = this.store.select(selectWalletTotals);

  constructor(private store: Store<IRootAppState>) {}
}
