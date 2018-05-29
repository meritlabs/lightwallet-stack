import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { PersistenceService2, ViewSettingsKey } from '@merit/common/services/persistence2.service';

declare global {
  interface Window {
    addthis_config: any;
    addthis_share: any;
  }
}

@Component({
  selector: 'app-get-started-tips',
  templateUrl: './get-started-tips.component.html',
  styleUrls: ['./get-started-tips.component.sass'],
  animations: [
    trigger('showTips', [
      state('true', style({ maxHeight: '1000px', padding: '30px 20px' })),
      state('false', style({})),
      transition('* => *', animate('300ms ease-in-out')),
    ]),
  ],
})
export class GetStartedTipsComponent implements OnInit, OnDestroy {
  constructor(private persistenceService: PersistenceService2) {}

  active: boolean;
  getArticle: boolean;
  syncWallet: boolean;
  copy: string = 'COPY';
  shareTitle: string = 'Merit - digital currency for humans.';
  shareUrl: string = 'wallet.merit.me';
  shareText: string = `Merit aims to be the world’s friendliest digital currency, making it dead simple to pay friends, buy goods, and manage your wealth.\n Get wallet now, your activation code: @`;

  private _wallets: DisplayWallet[];

  @Input()
  set wallets(val: DisplayWallet[]) {
    this._wallets = val;

    if (val && val[0] && window.addthis_config && window.addthis_share) {
      const { alias } = val[0];

      window.addthis_config.ui_email_title = this.shareTitle;
      window.addthis_config.ui_email_note = this.shareText + alias;
      window.addthis_share = {
        passthrough: {
          twitter: {
            text: `${this.shareTitle}\n ${this.shareText}${alias}`,
          },
          linkedin: {
            title: this.shareTitle,
            text: `${this.shareTitle}\n ${this.shareText}${alias}`,
            description: `${this.shareTitle}\n ${this.shareText}${alias}`,
          },
          facebook: {
            title: this.shareTitle,
            text: `${this.shareTitle}\n ${this.shareText}${alias}`,
          },
        },
      };
    }
  }

  get wallets(): DisplayWallet[] {
    return this._wallets;
  }

  setTipType: string = 'all';

  async ngOnInit() {
    const getActiveState = Boolean(await this.persistenceService.getViewSettings(ViewSettingsKey.GetStartedTips));

    if (getActiveState !== false) {
      this.show();
    }

    if (this.setTipType !== 'all' && this.active !== true) {
      this.show();
    }

    if (window.addthis_config && window.addthis_share) {
      // move created shareThis into right container
      const newParent = document.getElementById('pasteShareThis'),
        oldParent = document.getElementById('shareThis');

      while (oldParent.childNodes.length > 0) {
        newParent.appendChild(oldParent.childNodes[0]);
      }
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

  setType(type: string) {
    this.setTipType = type;
    this.show();

    // TODO cancel any previous timeouts before setting a new one
    setTimeout(() => {
      this.setTipType = 'all';
    }, 500);
  }

  show() {
    return this.persistenceService.setViewSettings(ViewSettingsKey.GetStartedTips, (this.active = true));
  }

  hide() {
    return this.persistenceService.setViewSettings(ViewSettingsKey.GetStartedTips, (this.active = false));
  }

  // rename to toggle
  showHide() {
    return this.persistenceService.setViewSettings(ViewSettingsKey.GetStartedTips, (this.active = !this.active));
  }

  getArticleAction() {
    this.getArticle = !this.getArticle;
  }

  syncWalletAction() {
    this.syncWallet = !this.syncWallet;
  }

  copyState() {
    this.copy = 'COPIED';
  }
}
