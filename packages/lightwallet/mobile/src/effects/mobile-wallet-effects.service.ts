import { Injectable } from '@angular/core';
import { WalletEffects } from '../../../common/effects/wallet.effects';
import { Actions, Effect } from '@ngrx/effects';
import { WalletService } from '../../../common/services/wallet.service';
import { AddressService } from '../../../common/services/address.service';
import { ProfileService } from '../../../common/services/profile.service';
import { TxFormatService } from '../../../common/services/tx-format.service';
import { Store } from '@ngrx/store';
import { IRootAppState } from '../../../common/reducers';
import { PersistenceService } from '../../../common/services/persistence.service';
import { PersistenceService2 } from '../../../common/services/persistence2.service';
import { Storage } from '@ionic/storage';
import { InviteRequestsService } from '../../../common/services/invite-request.service';
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
