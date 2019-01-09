import { Component } from '@angular/core';
import { AlertController, IonicPage, NavParams, ViewController } from 'ionic-angular';
import { MeritContact } from '@merit/common/models/merit-contact';
import { ContactsService } from '@merit/common/services/contacts.service';

@IonicPage()
@Component({
  selector: 'view-send-select-bind-contact',
  templateUrl: 'send-select-bind-contact.html',
})
export class SendSelectBindContactView {
  public contacts: Array<MeritContact>;
  public foundContacts: Array<MeritContact> = [];
  public searchQuery: string = '';
  public meritAddress: { address: string; network: string; alias: string };

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private contactsService: ContactsService,
    private alertCtrl: AlertController,
  ) {
    this.contacts = this.navParams.get('contacts');
    this.meritAddress = this.navParams.get('address');
  }

  ionViewDidLoad() {
    this.parseSearch();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  select(contact) {
    this.alertCtrl
      .create({
        title: `Bind this address to contact '${contact.name.formatted}'?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {},
          },
          {
            text: 'Bind',
            handler: () => {
              this.contactsService
                .bindAddressToContact(contact, this.meritAddress.address, this.meritAddress.alias)
                .then(contact => {
                  this.viewCtrl.dismiss(contact);
                });
            },
          },
        ],
      })
      .present();
  }

  getContactInitials(contact) {
    if (!contact.name || !contact.name.formatted) return '';
    let nameParts = contact.name.formatted
      .toUpperCase()
      .replace(/\s\s+/g, ' ')
      .split(' ');
    let name = nameParts[0].charAt(0);
    if (nameParts[1]) name += ' ' + nameParts[1].charAt(0);
    return name;
  }

  clearSearch() {
    this.searchQuery = '';
    this.parseSearch();
  }

  parseSearch() {
    if (!this.searchQuery) {
      return (this.foundContacts = this.contacts);
    }

    this.foundContacts = this.contacts.filter(contact => {
      return (
        !!contact.name &&
        !!contact.name.formatted &&
        contact.name.formatted.toLowerCase().match(this.searchQuery.toLowerCase())
      );
    });
  }
}
