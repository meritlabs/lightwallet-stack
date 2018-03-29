import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Tabs } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { Subscription } from 'rxjs/Subscription';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { UnlockRequestService } from '@merit/common/services/unlock-request.service';

@IonicPage({
  segment: 'transact'
})
@Component({
  selector: 'view-transact',
  templateUrl: 'transact.html',
  host: {
    '[class.keyboard-visible]': 'keyboardVisible'
  }
})
export class TransactView {
  @ViewChild('tabs') tabs: Tabs;

  private subs: Subscription[];
  keyboardVisible: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private logger: LoggerService,
              private profileService: ProfileService,
              private plt: Platform,
              private keyboard: Keyboard,
              private unlockRequestService: UnlockRequestService) {
  }

  async ngOnInit() {
    if (this.plt.is('android') && Keyboard.installed()) {
      this.subs = [
        this.keyboard.onKeyboardShow()
          .subscribe(() => {
            this.keyboardVisible = true;
          }),
        this.keyboard.onKeyboardHide()
          .subscribe(() => {
            this.keyboardVisible = false;
          })
      ];
    }

    await this.unlockRequestService.loadRequestsData();
  }

  async ngOnDestroy() {
    if (this.subs && this.subs.length) {
      this.subs.forEach((sub: Subscription) => sub.unsubscribe());
    }
  }

  async ionViewCanEnter() {
    const wallets = await this.profileService.wallets;
    return wallets && wallets.length > 0;
  }

  countUnlockRequests() {
    return this.unlockRequestService.activeRequestsNumber;
  }
}
