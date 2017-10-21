import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';


@IonicPage({
  segment: 'transact'
})
@Component({
  selector: 'page-transact',
  templateUrl: 'transact.html',
})
export class TransactPage {

  public homePage     = 'HomePage';
  public receivePage  = 'ReceivePage';
  public networkPage  = 'NetworkPage';
  public sendPage     = 'SendPage';
  public settingsPage = 'SettingsPage';

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
