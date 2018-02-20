import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { SendService } from 'merit/transact/send/send.service';
import { ISendMethod, SendMethodDestination, SendMethodType } from 'merit/transact/send/send-method.model';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AddressScannerService } from 'merit/utilities/import/address-scanner.service';
import { ProfileService } from 'merit/core/profile.service';
import * as _ from 'lodash';
import { ContactsProvider } from '../../../providers/contacts/contacts';
import { MeritContact } from '../../../models/merit-contact';

import { ENV } from '@app/env';
import { cleanAddress, isAlias } from '../../../utils/addresses';

const WEAK_PHONE_NUMBER_PATTERN = /^[\(\+]?\d+([\(\)\.-]\d*)*$/;
const WEAK_EMAIL_PATTERN = /^\S+@\S+/;
const ERROR_ADDRESS_NOT_CONFIRMED = 'ADDRESS_NOT_CONFIRMED';
const ERROR_ALIAS_NOT_FOUND = 'ALIAS_NOT_FOUND';

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
    noMerit: Array<MeritContact>,
    recent: Array<MeritContact>,
    toNewEntity: { destination: string, contact: MeritContact },
    error: string
  } = { withMerit: [], noMerit: [], recent: [], toNewEntity: null, error: null };

  private suggestedMethod: ISendMethod;

  public hasUnlockedWallets: boolean;
  public hasActiveInvites: boolean;

  constructor(private navCtrl: NavController,
              private contactsService: ContactsProvider,
              private profileService: ProfileService,
              private sendService: SendService,
              private modalCtrl: ModalController,
              private addressScanner: AddressScannerService) {
  }

  private async updateHasUnlocked() {
    const wallets = await this.profileService.getWallets();
    this.hasUnlockedWallets = wallets && wallets.some(w => w.confirmed);
    this.hasActiveInvites = wallets && wallets.some(w => w.status && w.status.availableInvites > 0);
  }

  async ionViewWillEnter() {
    this.loadingContacts = true;
    await this.contactsService.requestDevicePermission();
    await this.updateHasUnlocked();
    this.contacts = await this.contactsService.getAllMeritContacts();
    this.loadingContacts = false;
    await this.updateRecentContacts();
    return this.parseSearch();
  }

  async updateRecentContacts() {
    const sendHistory = await this.sendService.getSendHistory();
    const recentContacts = [];

    let results, contact;

    sendHistory
      .sort((a, b) => b.timestamp - a.timestamp)
      .forEach((record) => {
        results = this.contactsService.searchContacts(this.contacts, record.method.value);
        if (results && results.length) {
          recentContacts.push(results[0]);
          results = void 0;
        } else {
          contact = new MeritContact();
          contact.name.formatted = record.method.alias ? '@' + record.method.alias : record.method.value;
          recentContacts.push(contact);
          contact = void 0;
        }
      });

    this.recentContacts = _.uniqBy(recentContacts, 'name.formatted');
  }

  async parseSearch() {
    const result = { withMerit: [], noMerit: [], recent: [], toNewEntity: null, error: null };

    if (!this.searchQuery || !this.searchQuery.length) {
      this.clearSearch();
      this.debounceSearch.cancel();
      this.contacts.forEach((contact: MeritContact) => {
        _.isEmpty(contact.meritAddresses) ? result.noMerit.push(contact) : result.withMerit.push(contact);
      });
      result.recent = this.recentContacts;
      return this.searchResult = result;
    }

    if (this.searchQuery.length > 6 && this.searchQuery.indexOf('merit:') == 0)
      this.searchQuery = this.searchQuery.split('merit:')[1];

    this.debounceSearch();
  }

  private debounceSearch = _.debounce(() => this.search(), 300);

  private async search() {

    const result = { withMerit: [], noMerit: [], recent: [], toNewEntity: null, error: null };
    const input = cleanAddress(this.searchQuery.split('?')[0]);
    const _isAlias = isAlias(input);

    this.amount = parseInt(this.searchQuery.split('?micros=')[1]);

    let query = _isAlias ? input.slice(1) : input;

    if (!_isAlias) { //don't search for contacts if it is an alias
      this.contactsService.searchContacts(this.contacts, query)
        .forEach((contact: MeritContact) => {
          if (_.isEmpty(contact.meritAddresses)) {
            result.noMerit.push(contact);
          } else {
            result.withMerit.push(contact);
          }
        });
      this.contactsService.searchContacts(this.recentContacts, query)
        .forEach((contact) => {
          result.recent.push(contact);
        });
    } else {
      query = query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      result.withMerit = this.contacts.filter(contact =>
        _.some(contact.meritAddresses, (address) => address.alias && address.alias.match(query))
      );
      result.recent = this.recentContacts.filter(contact =>
        _.some(contact.meritAddresses, (address) => address.alias && address.alias.match(query))
      );
    }


    if (_.isEmpty(result.noMerit) && _.isEmpty(result.withMerit)) {
      if (this.isAddress(input)) {
        const addressInfo = await this.sendService.getAddressInfo(input);

        if (addressInfo && addressInfo.isConfirmed) {
          result.toNewEntity = { destination: SendMethodDestination.Address, contact: new MeritContact() };
          result.toNewEntity.contact.meritAddresses.push({
            address: addressInfo.address,
            alias: addressInfo.alias,
            network: ENV.network
          });
          this.suggestedMethod = {
            type: SendMethodType.Classic,
            destination: SendMethodDestination.Address,
            value: addressInfo.address,
            alias: addressInfo.alias
          };
        } else {
          result.error = ERROR_ADDRESS_NOT_CONFIRMED;
        }
      } else if (this.couldBeAlias(input)) {
        const addressInfo = await this.sendService.getAddressInfo(input);

        if (addressInfo && addressInfo.isConfirmed) {
          result.toNewEntity = { destination: SendMethodDestination.Address, contact: new MeritContact() };
          result.toNewEntity.contact.meritAddresses.push({
            address: addressInfo.address,
            alias: addressInfo.alias,
            network: ENV.network
          });
          this.suggestedMethod = {
            type: SendMethodType.Classic,
            destination: SendMethodDestination.Address,
            value: addressInfo.address,
            alias: addressInfo.alias
          };
        } else {
          result.error = ERROR_ALIAS_NOT_FOUND;
        }
      } else if (this.couldBeEmail(input)) {
        result.toNewEntity = { destination: SendMethodDestination.Email, contact: new MeritContact() };
        result.toNewEntity.contact.emails.push({ value: input });
        this.suggestedMethod = { type: SendMethodType.Easy, destination: SendMethodDestination.Email, value: input };
      } else if (this.couldBeSms(input)) {
        result.toNewEntity = { destination: SendMethodDestination.Sms, contact: new MeritContact() };
        result.toNewEntity.contact.phoneNumbers.push({ value: input });
        this.suggestedMethod = { type: SendMethodType.Easy, destination: SendMethodDestination.Sms, value: input };
      }
    }

    this.searchResult = result;
  }

  private couldBeEmail(input) {
    return WEAK_EMAIL_PATTERN.test(input);
  }

  private couldBeSms(input) {
    return WEAK_PHONE_NUMBER_PATTERN.test(input);
  }

  private couldBeAlias(input) {
    if (!isAlias(input)) return false;
    return this.sendService.couldBeAlias(input.slice(1));
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
      if (contact) {
        this.navCtrl.push('SendViaView', {
          contact: contact,
          amount: this.amount,
          isEasyEnabled: this.hasActiveInvites,
          suggestedMethod: this.suggestedMethod
        });
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
          suggestedMethod: this.suggestedMethod,
          isEasyEnabled: this.hasActiveInvites
        });
      }
    });
    modal.present();
  }

  sendToContact(contact) {
    this.navCtrl.push('SendViaView', {
      contact: contact,
      amount: this.amount,
      isEasyEnabled: this.hasActiveInvites
    });
  }

  sendToEntity(entity) {
    this.navCtrl.push('SendViaView', {
      contact: entity.contact,
      amount: this.amount,
      isEasyEnabled: this.hasActiveInvites,
      suggestedMethod: this.suggestedMethod
    });
  }

  async openScanner() {
    this.searchQuery = await this.addressScanner.scanAddress();
    this.parseSearch();
  }
}
