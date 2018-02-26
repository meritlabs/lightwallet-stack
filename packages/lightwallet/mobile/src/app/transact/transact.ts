import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, Platform, Tabs } from 'ionic-angular';
import { Logger } from 'merit/core/logger';
import { ProfileService } from 'merit/core/profile.service';
import { Keyboard } from '@ionic-native/keyboard';
import { Subscription } from 'rxjs/Subscription';
import { UnlockRequestService } from 'merit/core/unlock-request.service';

// Transact is the proposed name of the umbrella for the primary actions
// That exist through the tabs on the bottom of the screen.

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private logger: Logger,
    private profileService: ProfileService,
    private plt: Platform,
    private keyboard: Keyboard,
    private unlockRequestService: UnlockRequestService          
  ) {}

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

  ionViewCanEnter() {
    const profile = this.profileService.profile;
    return (profile && profile.credentials && profile.credentials.length > 0);
  }

  countUnlockRequests() {
    return this.unlockRequestService.activeRequestsNumber;  
  }
}
