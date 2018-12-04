import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { selectWalletById } from '@merit/common/reducers/wallets.reducer';
import { WalletService } from '@merit/common/services/wallet.service';
import { isWalletEncrypted } from '@merit/common/utils/wallet';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

// TODO: if this isn't used anywhere other than the export pages, let's rename this to "WalletExportGuard"
@Injectable()
export class WalletPasswordGuard implements CanActivate {
  wallet$: Observable<DisplayWallet> = this.route.params.pipe(
    switchMap((params: any) => this.store.select(selectWalletById(params.id))),
  );

  constructor(
    private route: ActivatedRoute,
    private walletService: WalletService,
    private store: Store<IRootAppState>,
    private passwordPromptCtrl: PasswordPromptController,
  ) {
    console.log('WalletPasswordGuard');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Promise<boolean>(async resolve => {
      const wallet = await this.store
        .select(selectWalletById(route.parent.params.id))
        .take(1)
        .toPromise();

      if (!isWalletEncrypted(wallet.client)) return resolve(true);

      const passwordPrompt = this.passwordPromptCtrl.createForWallet(wallet);
      passwordPrompt.onDidDismiss((password: string) => {
        if (password) {
          // we got a valid password, let's decrypt the wallet and allow the user to enter that route
          this.walletService.decryptWallet(wallet.client, password);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}
