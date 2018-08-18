import { Component } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicPage, Events } from 'ionic-angular';
import { ProfileService } from '@merit/common/services/profile.service';
import { PlatformService } from '@merit/common/services/platform.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { InviteRequest, InviteRequestsService } from '@merit/common/services/invite-request.service';
import { IRankData, IRankInfo } from '@merit/common/models/rank';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import {
  IWalletTotals, selectNumberOfInviteRequests, selectRankData,
  selectWallets,
  selectWalletsLoading,
  selectWalletTotals,
} from '@merit/common/reducers/wallets.reducer';
import { Observable } from 'rxjs/Observable';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { selectInvites } from '@merit/common/reducers/wallets.reducer';

@IonicPage()
@Component({
  selector: 'view-network',
  templateUrl: 'network.html',
})
export class NetworkView {

  loading$: Observable<boolean> = this.store.select(selectWalletsLoading);
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  totals$: Observable<IWalletTotals> = this.store.select(selectWalletTotals);
  rankData$: Observable<IRankData> = this.store.select(selectRankData);
  nInviteRequests$: Observable<string> = this.store.select(selectNumberOfInviteRequests);
  availableInvites$: Observable<number> = this.store.select(selectInvites);

  shareButtonAvailable: boolean;

  constructor(
    private toastCtrl: ToastControllerService,
    private socialSharing: SocialSharing,
    private profileService: ProfileService,
    private inviteRequestService: InviteRequestsService,
    private logger: LoggerService,
    private events: Events,
    private store: Store<IRootAppState>,
    platformService: PlatformService
  ) {
    this.shareButtonAvailable = platformService.isCordova;
  }

  shareAddress(address) {
    return this.socialSharing.share(address);
  }

  notifyCopy() {
    this.toastCtrl.success('Copied to clipboard');
  }
}

