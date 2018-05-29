import { Component, OnInit, OnDestroy } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { selectWallets, selectWalletsLoading } from '@merit/common/reducers/wallets.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { filter, take, tap } from 'rxjs/operators';

declare global {
  interface Window {
    addthis_config: any;
    addthis_share: any;
  }
}

@Component({
  selector: 'app-share-box',
  templateUrl: './share-box.component.html',
  styleUrls: ['./share-box.component.sass'],
})
export class ShareBoxComponent implements OnInit {
  constructor(private store: Store<IRootAppState>) {}

  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  selectedWallet: DisplayWallet;

  async ngOnInit() {
    const wallets: DisplayWallet[] = await this.wallets$
      .pipe(filter((wallets: DisplayWallet[]) => wallets.length > 0), take(1))
      .toPromise();
    console.log(wallets);

    if (wallets.length > 0) {
      this.selectedWallet = wallets[0];
    }
  }
  ngOnDestroy() {
    if (!(window.addthis_config && window.addthis_share)) return;

    // move created shareThis into right container
    const newParent = document.getElementById('shareThis'),
      oldParent = document.getElementById('pasteShareThis');

    while (oldParent.childNodes.length > 0) {
      newParent.appendChild(oldParent.childNodes[0]);
    }
  }

  initAddThis() {
    if (window.addthis_config && window.addthis_share) {
      // move created shareThis into right container
      const newParent = document.getElementById('pasteShareThis'),
        oldParent = document.getElementById('shareThis');

      while (oldParent.childNodes.length > 0) {
        newParent.appendChild(oldParent.childNodes[0]);
      }
    }
  }

  selectWallet(wallet: DisplayWallet) {
    this.selectedWallet = wallet;
  }
}
