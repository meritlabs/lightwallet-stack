import { Component } from '@angular/core';
import { WalletService } from '@merit/common/services/wallet.service';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, switchMap, take } from 'rxjs/operators';
import { IRootAppState } from '@merit/common/reducers';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { selectWalletById } from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'view-qr-code-backup',
  templateUrl: './qr-code-backup.view.html',
  styleUrls: ['./qr-code-backup.view.sass'],
})
export class QrCodeBackupView {
  mnemonic$: Observable<DisplayWallet> = this.route.parent.params.pipe(
    switchMap((params: any) => this.store.select(selectWalletById(params.id)).pipe(take(1))),
    switchMap((wallet: DisplayWallet) => fromPromise(this.walletService.getEncodedWalletInfo(wallet.client, null))),
  );

  constructor(
    private route: ActivatedRoute,
    private store: Store<IRootAppState>,
    private walletService: WalletService,
  ) {}
}
