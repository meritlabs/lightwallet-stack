import { Component } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wallet-details-history',
  templateUrl: './wallet-details-history.component.html',
  styleUrls: ['./wallet-details-history.component.sass']
})
export class WalletDetailHistoryComponent {
  wallet$: Observable<DisplayWallet>;

  constructor(private store: Store<IRootAppState>,
              private route: ActivatedRoute) {
  }
}
