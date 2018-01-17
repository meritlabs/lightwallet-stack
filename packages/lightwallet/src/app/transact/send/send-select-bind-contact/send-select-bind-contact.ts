import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';


@IonicPage()
@Component({
  selector: 'view-send-select-bind-contact',
  templateUrl: 'send-select-bind-contact.html',
})
export class SendSelectBindContactView {

  public contacts:Array<MeritContact>;
  public foundContacts:Array<MeritContact> = [];
  public searchQuery: string = '';


 constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {

  }

  ionViewDidLoad() {
    this.contacts = this.navParams.get('contacts');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(contact) {
    this.viewCtrl.dismiss(contact);
  }

  clearSearch() {
    this.searchQuery = '';
    this.parseSearch();
  }



  parseSearch() {
    this.foundContacts = this.contacts.filter((contact) => {
      return (contact.name.formatted && contact.name.formatted.match(this.searchQuery))
    })
  }

}
