import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'view-pending-invites',
  templateUrl: 'pending-invites.html',
})
export class PendingInvitesView {
  invites: any[];

  constructor(private navParams: NavParams) {
    this.invites = navParams.get('invites');
  }
}
