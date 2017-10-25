import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';


@IonicPage({
  segment: 'transact'
})
@Component({
  selector: 'page-transact',
  templateUrl: 'transact.html',
})
export class TransactView {

  public homeView     = 'HomeView';
  public receiveView  = 'ReceiveView';
  public networkView  = 'NetworkView';
  public sendView     = 'SendView';
  public settingsView = 'SettingsView';

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
