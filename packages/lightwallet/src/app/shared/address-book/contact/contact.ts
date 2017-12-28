import { Component, SecurityContext } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MeritContact } from 'merit/shared/address-book/contact/contact.model';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { ProfileService } from "merit/core/profile.service";
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from 'merit/shared/config.service';

@IonicPage()
@Component({
  selector: 'view-contact',
  templateUrl: 'contact.html',
})
export class ContactView {

  contact:MeritContact;
  wallets:Array<any>;

  constructor(
    private navCtrl: NavController,
    private navParams:NavParams,
    private addressBookService: AddressBookService,
    private alertCtrl:AlertController,
    private configService:ConfigService,
    private profileService:ProfileService,
    private sanitizer:DomSanitizer
  ) {
    this.contact = this.navParams.get('contact');
  }

  ionViewDidLoad() {
    this.getWallets();
  }

  private async getWallets() {
    if (this.wallets) {
      return this.wallets;
    } else {
      return this.wallets  = await this.profileService.getWallets();
    }
  }

  remove() {

    this.alertCtrl.create({
      title: 'Remove contact',
      message: 'Are you sure want to delete contact?',
      buttons: [
        {text: 'Cancel', role: 'cancel', handler: () => {}},
        {text: 'Ok', handler: (data) => {
            this.addressBookService.remove(this.contact.meritAddress, this.configService.getDefaults().network.name).then(() => {
              this.navCtrl.pop();
            });
          }
        }
      ]
    }).present();

  }

  toSendAmount() {
    this.getWallets().then((wallets) => {
      this.navCtrl.push('SendAmountView', {
        sending: true,
        contact: this.contact
      });
    });
  }

  toEditContact() {
    this.navCtrl.push('EditContactView', {contact: this.contact})
  }

  sanitizePhotoUrl(url:string) {
    return this.sanitizer.sanitize(SecurityContext.URL, url);
  }


}
