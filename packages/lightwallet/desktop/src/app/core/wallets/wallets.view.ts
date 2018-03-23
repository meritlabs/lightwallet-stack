import { Component, ViewEncapsulation } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { selectWallets, selectWalletsLoading } from '@merit/common/reducers/wallets.reducer';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'view-wallets',
  templateUrl: './wallets.view.html',
  styleUrls: ['./wallets.view.sass'],
  encapsulation: ViewEncapsulation.None
})
export class WalletsView {
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  walletsLoading$: Observable<boolean> = this.store.select(selectWalletsLoading);

  constructor(private store: Store<IRootAppState>, private toastCtrl: ToastControllerService) {
    this.toastCtrl.create({ title: 'Hello', text: 'Hello world', status: 'success' })
  }
}
