import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { PersistenceService2, UserSettingsKey } from '@merit/common/services/persistence2.service';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import { SetShareDialogAction } from '@merit/common/reducers/interface-preferences.reducer';

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
      state('true', style({ maxHeight: '1000px', padding: '60px 20px 30px' })),
      state('false', style({})),
      transition('* => *', animate('100ms cubic-bezier(0.445, 0.05, 0.55, 0.95)')),
    ]),
  ],
})
export class GetStartedTipsComponent implements OnInit {
  constructor(private persistenceService: PersistenceService2, private store: Store<IRootAppState>) {}

  active: boolean;
  getArticle: boolean;
  syncWallet: boolean;
  copy: string = 'COPY';

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
    const getActiveState = Boolean(await this.persistenceService.getUserSettings(UserSettingsKey.GetStartedTips));

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
    return this.persistenceService.setUserSettings(UserSettingsKey.GetStartedTips, (this.active = true));
  }

  hide() {
    return this.persistenceService.setUserSettings(UserSettingsKey.GetStartedTips, (this.active = false));
  }

  // rename to toggle
  showHide() {
    return this.persistenceService.setUserSettings(UserSettingsKey.GetStartedTips, (this.active = !this.active));
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

  showShare() {
    this.store.dispatch(new SetShareDialogAction(true));
  }
}
