import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { PersistenceService2, ViewSettingsKey } from '@merit/common/services/persistence2.service';
import { ElectronService } from '@merit/desktop/services/electron.service';

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
export class GetStartedTipsComponent implements OnInit {

  active: boolean;
  getArticle: boolean;
  syncWallet: boolean;
  copy: string = 'COPY';
  showShare: boolean = false;
  isElectron: boolean = false;

  constructor(private persistenceService: PersistenceService2) {
    this.isElectron = ElectronService.isElectronAvailable;
  }

  private _wallets: DisplayWallet[];

  @Input()
  set wallets(val: DisplayWallet[]) {
    this._wallets = val;
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
  shareActivate(val) {
    if (val) {
      this.showShare = true;
    } else {
      this.showShare = false;
    }
  }
}
