import { Component, SecurityContext } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ModalController } from 'ionic-angular';

import { WalletService } from 'merit/wallets/wallet.service';
import { ProfileService } from 'merit/core/profile.service';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { PopupService } from 'merit/core/popup.service';
import { SendService } from 'merit/transact/send/send.service';
import { Logger } from 'merit/core/logger';

import * as _ from 'lodash';
import { MeritWalletClient } from '../../../lib/merit-wallet-client/index';
import { emptyMeritContact, Searchable } from 'merit/shared/address-book/contact/contact.model';
import { AddressBook, MeritContact } from 'merit/shared/address-book/merit-contact.model';
import { MeritClient } from 'src/lib/merit-wallet-client/lib';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastConfig } from "merit/core/toast.config";
import { MeritToastController } from "merit/core/toast.controller";


/**
 * The Send View allows a user to frictionlessly send Merit to contacts
 * without needing to know if they are on the Merit network.
 * We differentiate between the notions of 'original contacts,' which are explicitly created by the user as well as deviceContacts that are already in the addressBook of the device they are using. 
 */
@IonicPage()
@Component({
  selector: 'send-view',
  templateUrl: 'send.html',
})
export class SendView {
  public static readonly CONTACTS_SHOW_LIMIT = 10;
  private walletsToTransfer: Array<any>; // Eventually array of wallets
  private showTransferCard: boolean;
  private wallets: Array<MeritWalletClient>;
  private contacts: Array<MeritContact>;
  private currentContactsPage = 0;
  private showMoreContacts: boolean = false;
  public filteredContacts: Array<MeritContact> = [];
  public renderingContacts: Array<MeritContact> = [];
  private formData: { 
    search: string
  };
  private searchFocus: boolean;
  private hasFunds: boolean;
  private hasOwnedMerit: boolean; 
  private network: string;

  contactsOffset = 0;
  contactsLimit  = 10;

  public hasContacts:boolean;
  public amountToSend:number;

  public loading:boolean;

  private static ADDRESS_LENGTH = 34;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private walletService: WalletService,
    private popupService: PopupService,
    private profileService: ProfileService,
    private logger: Logger,
    private sendService: SendService,
    private addressBookService:AddressBookService,
    private modalCtrl:ModalController,
    private sanitizer:DomSanitizer,
    private toastCtrl:MeritToastController,
    private alertCtrl:AlertController
  ) {
    this.logger.info("Hello SendView!!");
    this.hasOwnedMerit = this.profileService.hasOwnedMerit();
    this.formData = { search: '' };
  }

  async ionViewDidLoad() {
    await this.updateHasFunds().then(() => {
      this.contacts = [];
      this.initList();
      return this.initContactList();
    }).then(() => {
      return this.updateFilteredContacts('');
    }).catch((err) => {
      return this.popupService.ionicAlert('SendView Error:', err.toString());
    });
  }

  public ionViewWillEnter() {
    this.formData.search = '';
    this.loading = false;
  }

  private hasWallets(): boolean {
    return (_.isEmpty(this.wallets) ? false : true);
  }
  
  private updateHasFunds(): Promise<void> {
    return this.profileService.hasFunds().then((hasFunds) => {
      this.hasFunds = hasFunds;
      return Promise.resolve();
    });
  }

  private updateWalletList(): Promise<any> {
    let walletList:Array<any> = [];
    return new Promise((resolve, reject) => {
      _.each(this.wallets, (w) => {
        walletList.push({
          color: w.color,
          name: w.name, 
          recipientType: 'wallet',
          getAddress: () => {
            Promise.resolve(this.walletService.getAddress(w, false));
          }
        });
      });
      return resolve(walletList);
    });
  }

  private initContactList(): Promise<void> {
    return this.addressBookService.getAllMeritContacts().then((contacts) => {
      this.hasContacts = !_.isEmpty(contacts);

      this.contacts = this.contacts.concat(contacts);
      this.showMoreContacts = contacts.length > SendView.CONTACTS_SHOW_LIMIT;
    });
  }
  
  private initList():void {
    this.filteredContacts = [];
    
    // TODO: Resize this in the best-practices ionic3 wya.  
    //this.content.resize();  
    //TODO: Lifecycle tick if needed
  }

  public maybeEmail(contact: MeritContact): string {
    if (contact.emails.length < 1) return '';
    return contact.emails[0].value;
  }

  private couldBeEmail(search: string): boolean {
    var weakEmailPattern = /^\S+@\S+/
    return weakEmailPattern.test(search);
  }
  private couldBePhoneNumber(search: string): boolean {
    var weakPhoneNumberPattern = /^[\(\+]?\d+([\(\)\.-]\d*)*$/
    return weakPhoneNumberPattern.test(search);
  }

  private contactFromSearchTerm(term: string): MeritContact | null {
    if(this.couldBeEmail(term)) return this.justEmail(term);
    if(this.couldBePhoneNumber(term)) return this.justPhoneNumber(term);
    return null;
  }

  private justMeritAddress(meritAddress: string): MeritContact {
    let contact = new MeritContact();
    contact.name.formatted = meritAddress;
    contact.meritAddresses.push({
      network: this.network,
      address: meritAddress
    });
    return contact;
  }

  private justPhoneNumber(phoneNumber: string): MeritContact {
    let contact = new MeritContact();
    contact.name.formatted = `Send an SMS to ${phoneNumber}`;
    contact.phoneNumbers.push({value: phoneNumber});
    return contact;
  }

  private justEmail(email: string): MeritContact {
    let contact = new MeritContact();
    contact.name.formatted = `Send an email to ${email}`;
    contact.emails.push({value: email});
    return contact;
  }

  private parseSearch(input) {
    this.loading = true;

    if (input.indexOf('merit:') == 0) input = input.slice(6);
    if (input.indexOf('?micros=') != -1) {
      this.formData.search = input.split('?micros=')[0];
      this.amountToSend = input.split('?micros=')[1];
    } else {
      this.formData.search = input;
    }
    return this.updateFilteredContactsDebounce(this.formData.search);
  }


  private openScanner(): void {
    let modal = this.modalCtrl.create('ImportScanView');
    modal.onDidDismiss((code) => {
        if (code) {
          return this.parseSearch(code);
        }
    });
    modal.present();
  }
 
  private showMore(): void {
    this.currentContactsPage++;
    this.updateWalletList();
  }

  private searchInFocus(): void {
    this.searchFocus = true;
  }

  private searchBlurred(): void {
    if (this.formData.search == null || this.formData.search.length == 0) {
      this.searchFocus = false;
    }
  }

  private updateFilteredContactsDebounce = _.debounce(this.updateFilteredContacts, 200);

  public updateFilteredContacts(search: string): Promise<void> {

    // TODO: Improve to be more resilient.
    if(search && search.length == SendView.ADDRESS_LENGTH) {
      return this.sendService.isAddressValid(search).then((isValid) => {
        if (isValid) {
          return this.profileService.getWallets()
            .then((wallets) => {
              this.navCtrl.push('SendAmountView', {
                wallet: wallets[0],
                amount: this.amountToSend,
                sending: true,
                contact: this.justMeritAddress(search)
              });
            });
        } else {
          this.loading = false;
          this.alertCtrl.create({
            message: 'This address is invalid or has not been invited to the merit network yet!'
          }).present();
        }
      }).catch((err) => {
        this.loading = false;
        this.toastCtrl.create({
        message: err,
        cssClass: ToastConfig.CLASS_ERROR
         }).present();
      });
    }

    this.contactsOffset  = 0;
    this.filteredContacts = this.addressBookService.searchContacts(this.contacts, search);
    if(this.filteredContacts.length < 1) {
      let tempContact = this.contactFromSearchTerm(search);
      if(tempContact) this.filteredContacts.unshift(tempContact);
    }
    this.renderingContacts = this.filteredContacts.slice(0, this.contactsLimit);
    this.loading = false;
    Promise.resolve();
  }

  public goToAmount(item) {
    return this.profileService.getWallets().then((wallets) => {
      return this.navCtrl.push('SendAmountView', {
        wallet: wallets[0],
        amount: this.amountToSend,
        sending: true,
        contact: item
      });
    });
  }

  // TODO: Let's consider a better way to handle these multi-hop transitions.
  private createWallet():void {
    this.navCtrl.push('wallets').then(() => {
      this.navCtrl.push('add-wallet');
    });
  }

  private buyMert(): void {
    this.navCtrl.push('wallets').then(() => {
      this.navCtrl.push('buy-and-sell');
    });
  }

  renderMoreContacts(infiniteScroll) {
    this.contactsOffset += this.contactsLimit;
    this.renderingContacts = this.renderingContacts.concat(this.filteredContacts.slice(this.contactsOffset, this.contactsOffset+this.contactsLimit));
    infiniteScroll.complete();
  }

  sanitizePhotoUrl(url:string) {
    return this.sanitizer.sanitize(SecurityContext.URL, url);
  }

  private clearSearch() {
    this.formData.search = '';
    this.updateFilteredContacts('');
  }

}
