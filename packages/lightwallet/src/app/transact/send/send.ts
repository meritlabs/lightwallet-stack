import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';

import * as _ from 'lodash';
import { Logger } from 'merit/core/logger';
import { PopupService } from 'merit/core/popup.service';
import { ProfileService } from 'merit/core/profile.service';
import { ToastConfig } from 'merit/core/toast.config';
import { MeritToastController } from 'merit/core/toast.controller';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';
import { SendService } from 'merit/transact/send/send.service';
import { AddressScannerService } from 'merit/utilities/import/address-scanner.service';

import { WalletService } from 'merit/wallets/wallet.service';
import { MeritWalletClient } from '../../../lib/merit-wallet-client/index';


/**
 * The Send View allows a user to frictionlessly send Merit to contacts
 * without needing to know if they are on the Merit network.
 * We differentiate between the notions of 'original contacts,' which are explicitly created by the user as well as deviceContacts that are already in the addressBook of the device they are using.
 */
@IonicPage()
@Component({
  selector: 'send-view',
  templateUrl: 'send.html',
  providers: [BarcodeScanner]
})
export class SendView {
  public static readonly CONTACTS_SHOW_LIMIT = 10;
  private static ADDRESS_LENGTH = 34;
  public filteredContacts: Array<MeritContact> = [];
  public renderingContacts: Array<MeritContact> = [];
  formData = { search: '' };
  contactsOffset = 0;
  contactsLimit = 10;
  public hasContacts: boolean;
  public amountToSend: number;
  public loading: boolean;
  // TODO use RxJS instead
  updateFilteredContactsDebounce = _.debounce(this.updateFilteredContacts.bind(this), 200);
  private walletsToTransfer: Array<any>; // Eventually array of wallets
  private showTransferCard: boolean;
  private wallets: Array<MeritWalletClient>;
  private contacts: Array<MeritContact>;
  private currentContactsPage = 0;
  private showMoreContacts: boolean = false;
  private searchFocus: boolean;
  private hasFunds: boolean;
  private hasOwnedMerit: boolean = this.profileService.hasOwnedMerit();
  private network: string;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private walletService: WalletService,
              private popupService: PopupService,
              private profileService: ProfileService,
              private logger: Logger,
              private sendService: SendService,
              private addressBookService: AddressBookService,
              private modalCtrl: ModalController,
              private sanitizer: DomSanitizer,
              private toastCtrl: MeritToastController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private viewCtrl: ViewController,
              private addressScanner: AddressScannerService) {
    this.logger.info('Hello SendView!!');
  }

  async ngOnInit() {
    try {
      await this.updateHasFunds();
      this.contacts = [];
      this.initList();
      await this.initContactList();
      await this.updateFilteredContacts('');

      console.log('nav is ', this.navCtrl);
    } catch (err) {
      await this.popupService.ionicAlert('SendView Error:', err.toString());
    }
  }

  public ionViewWillEnter() {
    this.formData.search = '';
    this.loading = false;
  }

  async updateHasFunds(): Promise<void> {
    this.hasFunds = await this.profileService.hasFunds();
  }

  public maybeEmail(contact: MeritContact): string {
    if (contact.emails.length < 1) return '';
    return contact.emails[0].value;
  }

  async openScanner() {
    this.parseSearch(await this.addressScanner.scanAddress());
  }

  showMore(): void {
    this.currentContactsPage++;
    this.updateWalletList();
  }

  searchInFocus(): void {
    this.searchFocus = true;
  }

  searchBlurred(): void {
    if (this.formData.search == null || this.formData.search.length == 0) {
      this.searchFocus = false;
    }
  }

  async updateFilteredContacts(search: string) {
    // TODO: Improve to be more resilient.
    if (search && search.length == SendView.ADDRESS_LENGTH) {
      try {
        const isValid: boolean = await this.sendService.isAddressValid(search);
        if (isValid) {
          const wallets = await this.profileService.getWallets();
          console.log('nav is ', this.navCtrl);
          this.navCtrl.push('SendAmountView', {
            wallet: wallets[0],
            amount: this.amountToSend,
            sending: true,
            contact: this.justMeritAddress(search)
          });
        } else {
          this.loading = false;
          await this.alertCtrl.create({
            message: 'This address is invalid or has not been invited to the merit network yet!'
          }).present();
        }
      } catch (err) {
        this.loading = false;
        await this.toastCtrl.create({
          message: err,
          cssClass: ToastConfig.CLASS_ERROR
        }).present();
      }
    }

    this.contactsOffset = 0;
    this.filteredContacts = this.addressBookService.searchContacts(this.contacts, search);

    if (this.filteredContacts.length < 1) {
      let tempContact = this.contactFromSearchTerm(search);
      if (tempContact) this.filteredContacts.unshift(tempContact);
    }

    this.renderingContacts = this.filteredContacts.slice(0, this.contactsLimit);
    this.loading = false;
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
  createWallet(): void {
    this.navCtrl.push('wallets').then(() => {
      this.navCtrl.push('add-wallet');
    });
  }

  buyMert(): void {
    this.navCtrl.push('wallets').then(() => {
      this.navCtrl.push('buy-and-sell');
    });
  }

  renderMoreContacts(infiniteScroll) {
    this.contactsOffset += this.contactsLimit;
    this.renderingContacts = this.renderingContacts.concat(this.filteredContacts.slice(this.contactsOffset, this.contactsOffset + this.contactsLimit));
    infiniteScroll.complete();
  }

  sanitizePhotoUrl(url: string) {
    return this.sanitizer.sanitize(SecurityContext.URL, url);
  }

  private hasWallets(): boolean {
    return (_.isEmpty(this.wallets) ? false : true);
  }

  // TODO this can be sync
  private async updateWalletList(): Promise<any> {
    return this.wallets.map((wallet: any) => ({
      color: wallet.color,
      name: wallet.name,
      recipientType: 'wallet',
      getAddress: async () => this.walletService.getAddress(wallet, false)
    }));
  }

  private async initContactList(): Promise<void> {
    const contacts = await this.addressBookService.getAllMeritContacts();
    this.hasContacts = !_.isEmpty(contacts);
    this.contacts = this.contacts.concat(contacts);
    this.showMoreContacts = contacts.length > SendView.CONTACTS_SHOW_LIMIT;
  }

  private initList(): void {
    this.filteredContacts = [];

    // TODO: Resize this in the best-practices ionic3 wya.
    //this.content.resize();
    //TODO: Lifecycle tick if needed
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
    if (this.couldBeEmail(term)) return this.justEmail(term);
    if (this.couldBePhoneNumber(term)) return this.justPhoneNumber(term);
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
    contact.phoneNumbers.push({ value: phoneNumber });
    return contact;
  }

  private justEmail(email: string): MeritContact {
    let contact = new MeritContact();
    contact.name.formatted = `Send an email to ${email}`;
    contact.emails.push({ value: email });
    return contact;
  }

  private parseSearch(input) {
    if (!input) return;
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

  private clearSearch() {
    this.formData.search = '';
    this.updateFilteredContacts('');
  }

}
