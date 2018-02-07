import { Component,  SecurityContext} from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SendService } from 'merit/transact/send/send.service';
import { SendMethod } from 'merit/transact/send/send-method.model';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AddressScannerService } from 'merit/utilities/import/address-scanner.service';
import { ProfileService } from 'merit/core/profile.service';

import * as _ from 'lodash';


@IonicPage()
@Component({
  selector: 'view-send',
  templateUrl: 'send.html',
  providers: [BarcodeScanner]
})
export class SendView {
  public searchQuery: string = '';
  public loadingContacts: boolean = false;
  public contacts: Array<MeritContact> = [];
  private recentContacts: Array<MeritContact> = [];
  public amount: number;
  public searchResult: {
    withMerit: Array<MeritContact>,
    noMerit:Array<MeritContact>,
    recent:Array<MeritContact>,
    toNewEntity:{destination:string, contact:MeritContact},
    error:string
  } = {withMerit: [], noMerit: [], recent: [], toNewEntity: null, error: null};

  private suggestedMethod:SendMethod;

  private readonly ERROR_ADDRESS_NOT_BEACONED;

  public hasUnlockedWallets:boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private addressBookService:AddressBookService,
    private profileService: ProfileService,
    private sanitizer:DomSanitizer,
    private sendService: SendService,
    private modalCtrl:ModalController,
    private addressScanner: AddressScannerService
  ) {

  }

  async ngOnInit() {
    this.loadingContacts = true;
    await this.updateHasUnlocked();
    this.contacts = await this.addressBookService.getAllMeritContacts();
    this.loadingContacts = false;
    this.updateRecentContacts();
  }

  private async updateHasUnlocked() {
    const wallets = await this.profileService.getWallets();
    this.hasUnlockedWallets = wallets && wallets.some(w => w.unlocked);
  }

  async ionViewWillEnter() {
    this.updateHasUnlocked();
    this.contacts = await this.addressBookService.getAllMeritContacts();
    this.updateRecentContacts();
    this.parseSearch();
  }

  async doRefresh(refresher) {
    this.contacts = await this.addressBookService.getAllMeritContacts();
    this.parseSearch();
  }

  async updateRecentContacts() {

    let sendHistory = await this.sendService.getSendHistory();
    sendHistory.sort((a,b) => b.timestamp - a.timestamp);
    sendHistory.forEach((record) => {
      if (this.recentContacts.some(contact => JSON.stringify(contact.name) == JSON.stringify(record.contact.name))) return;
      this.recentContacts.push(record.contact);
    });

  }

  async parseSearch() {
    if (!this.searchQuery || !this.searchQuery.length) return;
    if (this.searchQuery.indexOf('merit') == 0) this.searchQuery = this.searchQuery.split('merit:')[1];
    let input = this.searchQuery.split('?')[0];
    this.amount = parseInt(this.searchQuery.split('?micros=')[1]);

    let result =  { withMerit: [], noMerit: [], recent: [], toNewEntity:null, error: null };

    if (_.isEmpty(result.noMerit) && _.isEmpty(result.withMerit)) {
      if (this.isAddress(input) || this.sendService.couldBeAlias(input)) {
        const address = await this.sendService.getValidAddress(input);

        if (address) {
          result.toNewEntity = { destination: SendMethod.DESTINATION_ADDRESS, contact: new MeritContact() };
          result.toNewEntity.contact.meritAddresses.push({ address, network: this.sendService.getAddressNetwork(address).name });
          this.suggestedMethod = { type: SendMethod.TYPE_EASY, destination: SendMethod.DESTINATION_ADDRESS, value: address };
        } else {
          this.searchResult.error = this.ERROR_ADDRESS_NOT_BEACONED;
        }
      } else if (this.couldBeEmail(input)) {
        result.toNewEntity = {destination: SendMethod.DESTINATION_EMAIL, contact: new MeritContact()};
        result.toNewEntity.contact.emails.push({value: input})
        this.suggestedMethod = {type: SendMethod.TYPE_EASY, destination: SendMethod.DESTINATION_EMAIL, value: input};
      } else if (this.couldBeSms(input)) {
        result.toNewEntity = {destination: SendMethod.DESTINATION_SMS, contact: new MeritContact()};
        result.toNewEntity.contact.phoneNumbers.push({value: input})
        this.suggestedMethod = {type: SendMethod.TYPE_EASY, destination: SendMethod.DESTINATION_SMS, value: input};
      }
    }

    this.addressBookService.searchContacts(this.contacts, input).forEach((contact) => {
      if (_.isEmpty(contact.meritAddresses)) {
        result.noMerit.push(contact);
      } else {
        result.withMerit.push(contact);
      }
    });

    this.addressBookService.searchContacts(this.recentContacts, input).forEach((contact) => {
      result.recent.push(contact);
    });


    this.searchResult = result;
  }

  private couldBeEmail(input) {
    var weakEmailPattern = /^\S+@\S+/
    return weakEmailPattern.test(input);
  }

  private couldBeSms(input) {
    var weakPhoneNumberPattern = /^[\(\+]?\d+([\(\)\.-]\d*)*$/
    return weakPhoneNumberPattern.test(input);
  }

  private async isValidAddress(input) {
    return await this.sendService.isAddressValid(input);
  }

  private isAddress(input) {
    return this.sendService.isAddress(input);
  }

  sanitizePhotoUrl(url:string) {
    return this.sanitizer.sanitize(SecurityContext.URL, url);
  }

  clearSearch() {
    this.searchQuery = '';
    this.parseSearch();
  }

  createContact() {
    let meritAddress = this.searchResult.toNewEntity.contact.meritAddresses[0];
    let modal = this.modalCtrl.create('SendCreateContactView', {address: meritAddress});
    modal.onDidDismiss((contact) => {
      console.log(contact);
      if (contact) {
        this.navCtrl.push('SendViaView', {contact: contact, amount: this.amount});
      }
    });
    modal.present();
  }

  bindAddressToContact() {
    let meritAddress = this.searchResult.toNewEntity.contact.meritAddresses[0];
    let modal = this.modalCtrl.create('SendSelectBindContactView', {contacts: this.contacts, address: meritAddress});
    modal.onDidDismiss((contact) => {
      if (contact) {
          this.navCtrl.push('SendViaView', {contact: contact, amount: this.amount, suggestedMethod: this.suggestedMethod});
      }
    });
    modal.present();
  }

  sendToContact(contact) {
    this.navCtrl.push('SendViaView', {contact: contact, amount: this.amount, suggestedMethod: this.suggestedMethod});
  }

  sendToEntity(entity) {
    this.navCtrl.push('SendViaView', {contact: entity.contact, amount: this.amount, suggestedMethod: this.suggestedMethod});
  }

  getContactInitials(contact) {
    if (!contact.name || !contact.name.formatted) return '';
    let nameParts = contact.name.formatted.toUpperCase().replace(/\s\s+/g, ' ').split(' ');
    let name = nameParts[0].charAt(0);
    if (nameParts[1]) name += ' '+nameParts[1].charAt(0);
    return name;
  }

  async openScanner() {
    this.searchQuery = await this.addressScanner.scanAddress();
    this.parseSearch();
  }
}
