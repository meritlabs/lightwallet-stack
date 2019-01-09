import { Component } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { IRootAppState } from '@merit/common/reducers';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { selectWalletById } from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-mnemonic-phrase',
  templateUrl: './mnemonic-phrase.view.html',
  styleUrls: ['./mnemonic-phrase.view.sass'],
})
export class MnemonicPhraseView {
  mnemonic$: Observable<DisplayWallet> = this.route.parent.params.pipe(
    switchMap((params: any) => this.store.select(selectWalletById(params.id))),
    map((wallet: DisplayWallet) => wallet.client.getMnemonic()),
  );

  constructor(private route: ActivatedRoute, private store: Store<IRootAppState>) {}
}
