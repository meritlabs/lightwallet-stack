import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ProfileService } from '@merit/common/services/profile.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { IRootAppState } from '../../../../../common/reducers';
import { selectWallets } from '../../../../../common/reducers/wallets.reducer';
import { DisplayWallet } from '../../../../../common/models/display-wallet';

@IonicPage()
@Component({
  selector: 'view-select-wallet',
  templateUrl: 'select-wallet.html',
})
export class SelectWalletModal {
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  selectedWallet: DisplayWallet;

  showInvites: boolean;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private profileService: ProfileService,
    private store: Store<IRootAppState>,
  ) {}

  async ngOnInit() {
    this.selectedWallet = this.navParams.get('selectedWallet');
    this.showInvites = this.navParams.get('showInvites');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(wallet: DisplayWallet) {
    this.viewCtrl.dismiss(wallet);
  }
}
