import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, Tabs } from 'ionic-angular';
import { Logger } from 'merit/core/logger';
import { ProfileService } from 'merit/core/profile.service';

// Transact is the proposed name of the umbrella for the primary actions
// That exist through the tabs on the bottom of the screen.

@IonicPage({
  segment: 'transact'
})
@Component({
  selector: 'view-transact',
  templateUrl: 'transact.html',
})
export class TransactView {
  @ViewChild('tabs') tabs: Tabs;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private logger: Logger,
              private profileService: ProfileService) {
    this.logger.info('Hello TRANSACT VIEW!');
  }

  ionViewCanEnter() {
    const profile = this.profileService.profile;
    return (profile && profile.credentials && profile.credentials.length > 0);
  }
}
