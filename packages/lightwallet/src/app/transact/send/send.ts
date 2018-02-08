import { Component, SecurityContext } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { SendService } from 'merit/transact/send/send.service';
import { SendMethod } from 'merit/transact/send/send-method.model';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AddressScannerService } from 'merit/utilities/import/address-scanner.service';
import { ProfileService } from 'merit/core/profile.service';
import * as _ from 'lodash';
import { ContactsProvider } from '../../../providers/contacts/contacts';
import { MeritContact } from '../../../models/merit-contact';

const WEAK_PHONE_NUMBER_PATTERN = /^[\(\+]?\d+([\(\)\.-]\d*)*$/;
const WEAK_EMAIL_PATTERN = /^\S+@\S+/;
const ERROR_ADDRESS_NOT_CONFIRMED = 'ADDRESS_NOT_CONFIRMED';

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

  private suggestedMethod: SendMethod;

  public hasUnlockedWallets: boolean;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private contactsService: ContactsProvider,
              private profileService: ProfileService,
              private sanitizer: DomSanitizer,
              private sendService: SendService,
              private modalCtrl: ModalController,
              private addressScanner: AddressScannerService) {
  }

  private async updateHasUnlocked() {
    const wallets = await this.profileService.getWallets();
    this.hasUnlockedWallets = wallets && wallets.some(w => w.unlocked);
  }

  async ionViewWillEnter() {
    this.loadingContacts = true;
    await this.updateHasUnlocked();
    this.contacts = await this.contactsService.getAllMeritContacts();
    this.loadingContacts = false;
    this.updateRecentContacts();
    this.parseSearch();
  }

  async updateRecentContacts() {
    const sendHistory = await this.sendService.getSendHistory();
    sendHistory
      .sort((a, b) => b.timestamp - a.timestamp)
      .forEach((record) => {
        if (this.recentContacts.some(contact => JSON.stringify(contact.name) == JSON.stringify(record.contact.name))) return;
        this.recentContacts.push(record.contact);
      });
  }

  async parseSearch() {
    let result = { withMerit: [], noMerit: [], recent: [], toNewEntity: null, error: null };

    if (!this.searchQuery || !this.searchQuery.length) {
      this.clearSearch();
      this.contacts.forEach((contact: MeritContact) => {
        _.isEmpty(contact.meritAddresses) ?  result.noMerit.push(contact) : result.withMerit.push(contact);
      });
      return this.searchResult = result;
    }

    if (this.searchQuery.length > 6 && this.searchQuery.indexOf('merit:') == 0)
      this.searchQuery = this.searchQuery.split('merit:')[1];

    const input = this.searchQuery.split('?')[0];

    this.amount = parseInt(this.searchQuery.split('?micros=')[1]);

    if (_.isEmpty(result.noMerit) && _.isEmpty(result.withMerit)) {
      if (this.isAddress(input) || this.sendService.couldBeAlias(input)) {
        const address = await this.sendService.getValidAddress(input);

        if (address) {
          result.toNewEntity = { destination: SendMethod.DESTINATION_ADDRESS, contact: new MeritContact() };
          result.toNewEntity.contact.meritAddresses.push({ address, network: this.sendService.getAddressNetwork(address).name });
          this.suggestedMethod = { type: SendMethod.TYPE_EASY, destination: SendMethod.DESTINATION_ADDRESS, value: address };
        } else {
          this.searchResult.error = ERROR_ADDRESS_NOT_CONFIRMED;
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

    this.contactsService.searchContacts(this.contacts, input)
      .forEach((contact: MeritContact) => {
        if (_.isEmpty(contact.meritAddresses)) {
          result.noMerit.push(contact);
        } else {
          result.withMerit.push(contact);
        }
      });

    this.contactsService.searchContacts(this.recentContacts, input)
      .forEach((contact) => {
        result.recent.push(contact);
      });

    this.searchResult = result;
  }

  private couldBeEmail(input) {
    return WEAK_EMAIL_PATTERN.test(input);
  }

  private couldBeSms(input) {
    return WEAK_PHONE_NUMBER_PATTERN.test(input);
  }

  private async isValidAddress(input) {
    return await this.sendService.isAddressValid(input);
  }

  private isAddress(input) {
    return this.sendService.isAddress(input);
  }

  clearSearch() {
    this.searchQuery = '';
    delete this.suggestedMethod;
    if (this.searchResult) {
      delete this.searchResult.toNewEntity;
    }
  }

  createContact() {
    let meritAddress = this.searchResult.toNewEntity.contact.meritAddresses[0];
    let modal = this.modalCtrl.create('SendCreateContactView', { address: meritAddress });
    modal.onDidDismiss((contact) => {
      console.log(contact);
      if (contact) {
        this.navCtrl.push('SendViaView', { contact: contact, amount: this.amount });
      }
    });
    modal.present();
  }

  bindAddressToContact() {
    let meritAddress = this.searchResult.toNewEntity.contact.meritAddresses[0];
    let modal = this.modalCtrl.create('SendSelectBindContactView', { contacts: this.contacts, address: meritAddress });
    modal.onDidDismiss((contact) => {
      if (contact) {
        this.navCtrl.push('SendViaView', {
          contact: contact,
          amount: this.amount,
          suggestedMethod: this.suggestedMethod
        });
      }
    });
    modal.present();
  }

  sendToContact(contact) {
    this.navCtrl.push('SendViaView', { contact: contact, amount: this.amount, suggestedMethod: this.suggestedMethod });
  }

  sendToEntity(entity) {
    this.navCtrl.push('SendViaView', {
      contact: entity.contact,
      amount: this.amount,
      suggestedMethod: this.suggestedMethod
    });
  }

  async openScanner() {
    this.searchQuery = await this.addressScanner.scanAddress();
    this.parseSearch();
  }
}
