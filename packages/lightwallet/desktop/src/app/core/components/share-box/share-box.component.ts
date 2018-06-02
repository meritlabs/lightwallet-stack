import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { selectWallets } from '@merit/common/reducers/wallets.reducer';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { filter, take } from 'rxjs/operators';

declare global {
  interface Window {
    addthis_config: any;
    addthis_share: any;
  }
}

@Component({
  selector: 'app-share-box',
  templateUrl: './share-box.component.html',
  styleUrls: ['./share-box.component.sass']
})
export class ShareBoxComponent implements OnInit {
  constructor(private store: Store<IRootAppState>, private toastCtrl: ToastControllerService) {}

  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  selectedWallet = {
    id: null,
    name: 'Select wallet'
  };
  shareAlias: string;
  shareLink: string;

  shareTitle: string = 'Merit - digital currency for humans.';
  shareUrl: string = 'wallet.merit.me';
  shareText: string = `Merit aims to be the world’s friendliest digital currency, making it dead simple to pay friends, buy goods, and manage your wealth.\n Get wallet now, your activation code: `;

  @Output() dismiss: EventEmitter<void> = new EventEmitter<void>();

  async ngOnInit() {
    const wallets: DisplayWallet[] = await this.wallets$
      .pipe(filter((wallets: DisplayWallet[]) => wallets.length > 0), take(1))
      .toPromise();

    if (wallets.length > 0) {
      this.selectedWallet = wallets[0];
      this.selectWallet(wallets[0]);
      this.initAddThis();
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
      if (window.addthis_config && window.addthis_share) {
        let alias = this.shareAlias;

        window.addthis_config.ui_email_title = this.shareTitle;
        window.addthis_config.ui_email_note = this.shareText + alias;
        window.addthis_share = {
          url: this.shareLink,
          title: this.shareTitle,
          description: `${this.shareTitle}\n ${this.shareText}${alias}`,
          passthrough: {
            twitter: {
              text: `${this.shareTitle}\n ${this.shareText}${alias}`
            },
            linkedin: {
              title: this.shareTitle,
              text: `${this.shareTitle}\n ${this.shareText}${alias}`,
              description: `${this.shareTitle}\n ${this.shareText}${alias}`
            },
            facebook: {
              title: this.shareTitle,
              text: `${this.shareTitle}\n ${this.shareText}${alias}`,
              description: `${this.shareTitle}\n ${this.shareText}${alias}`
            }
          }
        };
      }
    }
  }

  selectWallet(wallet: DisplayWallet) {
    this.selectedWallet = wallet;
    if (wallet.alias) {
      this.shareAlias = `@${wallet.alias}`;
    } else {
      this.shareAlias = wallet.referrerAddress;
    }
    this.shareLink = `${window.location.origin}?invite=${this.shareAlias}`;
  }

  onCopy() {
    this.toastCtrl.success('Share link copied to clipboard!');
  }

  closeWindow() {
    if (window.addthis_config && window.addthis_share) {
      // move created shareThis into right container
      const newParent = document.getElementById('shareThis'),
        oldParent = document.getElementById('pasteShareThis');

      while (oldParent.childNodes.length > 0) {
        newParent.appendChild(oldParent.childNodes[0]);
      }
    }

    this.dismiss.emit();
  }
}
