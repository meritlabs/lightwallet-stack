import { Component } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { IVault } from '@merit/common/models/vault';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { IMeritToastConfig, ToastControllerService } from '@merit/common/services/toast-controller.service';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import {
  IWalletTotals,
  selectWallets,
  selectWalletsLoading,
  selectWalletTotals,
} from '@merit/common/reducers/wallets.reducer';
import { getLatestValue } from '@merit/common/utils/observables';
import { RefreshWalletsAction } from '@merit/common/reducers/wallets.reducer';

@IonicPage()
@Component({
  selector: 'view-wallets',
  templateUrl: 'wallets.html',
})
export class WalletsView {

  loading$: Observable<boolean> = this.store.select(selectWalletsLoading);
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  totals$: Observable<IWalletTotals> = this.store.select(selectWalletTotals);

  vaults: IVault[] = [];

  showCommunityPopup: boolean;
  communitySize: number;
  vaultsMoreInfoMode: boolean;

  constructor(
    private navCtrl: NavController,
    private logger: LoggerService,
    private toastCtrl: ToastControllerService,
    private profileService: ProfileService,
    private platform: Platform,
    private store: Store<IRootAppState>,
  ) {
  }

  async ngOnInit() {
    this.showCommunityPopup = !(await this.profileService.isCommunityPopupClosed());
    try {
      this.vaults = await this.profileService.getVaults();
    } catch (e) {
    } finally {
    }
  }

  async ionViewWillEnter() {
    this.vaults = await this.profileService.getVaults();
  }

  async doRefresh(r) {
    this.store.dispatch(new RefreshWalletsAction());
    await getLatestValue(this.store.select(selectWalletsLoading), loading => !loading);
    r.complete();
  }

  async toAddWallet() {
    const wallets = await getLatestValue(this.wallets$, wallets => wallets.length > 0);
    let referralAddress = '';
    wallets.some((w: DisplayWallet) => {
      if (w.balance.spendableInvites) {
        referralAddress = w.client.rootAddress.toString();
        return true;
      }
    });
    return this.navCtrl.push('CreateWalletView', { parentAddress: referralAddress });
  }

  closeCommunityPopup() {
    this.showCommunityPopup = false;
    this.profileService.closeCommunityPopup();
  }
}

