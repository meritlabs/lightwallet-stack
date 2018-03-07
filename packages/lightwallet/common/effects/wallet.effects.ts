import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { UpdateWalletsAction, WalletsActionType } from '@merit/common/reducers/wallets.reducer';
import { WalletService } from '@merit/common/services/wallet.service';
import { defer } from 'rxjs/observable/defer';
import { ProfileService } from '@merit/common/services/profile.service';
import { createDisplayWallet, DisplayWallet } from '@merit/common/models/display-wallet';
import 'rxjs/add/observable/fromPromise';
import { AddressService } from '@merit/common/services/address.service';

@Injectable()
export class WalletEffects {
  @Effect()
  refresh$: Observable<UpdateWalletsAction> = this.actions$.pipe(
    ofType(WalletsActionType.Refresh),
    switchMap(() => Observable.fromPromise(this.updateAllWallets())),
    map((wallets: DisplayWallet[]) => {
      console.log('Updating wallets in state', wallets);
      return new UpdateWalletsAction(wallets);
    })
  );

  constructor(private actions$: Actions,
              private walletService: WalletService,
              private addressService: AddressService,
              private profileService: ProfileService) {
  }

  private async updateAllWallets(): Promise<DisplayWallet[]> {
    const wallets = await this.profileService.getWallets();
    return Promise.all<DisplayWallet>(
      wallets.map(w => createDisplayWallet(w, this.walletService, this.addressService))
    );
  }
}
