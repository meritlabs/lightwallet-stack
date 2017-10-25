import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';


@IonicPage({
  segment: 'transact'
})
@Component({
  selector: 'page-transact',
  templateUrl: 'transact.html',
})
export class TransactComponent {

  public homeComponent     = 'HomeComponent';
  public receiveComponent  = 'ReceiveComponent';
  public networkComponent  = 'NetworkComponent';
  public sendComponent     = 'SendComponent';
  public settingsComponent = 'SettingsComponent';

  @ViewChild('tabs') tabRef: Tabs;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    //do something here
    this.tabRef.select(0);
  }

}
