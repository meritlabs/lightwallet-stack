import { Injectable } from '@angular/core';
import { WalletEffects } from '@merit/common/effects/wallet.effects';
import { Actions, Effect } from '@ngrx/effects';
import { WalletService } from '@merit/common/services/wallet.service';
import { AddressService } from '@merit/common/services/address.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';
import { Storage } from '@ionic/storage';
import { InviteRequestsService } from '@merit/common/services/invite-request.service';
import { App } from 'ionic-angular';

@Injectable()
export class MobileWalletEffects extends WalletEffects {
  constructor(
    actions$: Actions,
    walletService: WalletService,
    addressService: AddressService,
    profileService: ProfileService,
    txFormatService: TxFormatService,
    store: Store<IRootAppState>,
    persistenceService: PersistenceService,
    persistenceService2: PersistenceService2,
    storage: Storage,
    inviteRequestsService: InviteRequestsService,
    private app: App,
  ) {
    super(
      actions$,
      walletService,
      addressService,
      profileService,
      txFormatService,
      store,
      persistenceService,
      persistenceService2,
      storage,
      inviteRequestsService,
    );
  }

  protected async onWalletDelete(authorized: boolean) {
    if (!authorized) {
      await this.storage.clear();
      const nav = this.app.getActiveNav();
      nav.setRoot('onboarding');
    }
  }
}
