import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, Events, ToastController } from 'ionic-angular';
import * as _ from 'lodash';
import { ENV } from '@app/env';
import { MeritContact } from '@merit/common/models/merit-contact';
import { ContactsService } from '@merit/common/services/contacts.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { AddressScannerService } from '@merit/mobile/app/utilities/import/address-scanner.service';
import { cleanAddress, isAlias } from '@merit/common/utils/addresses';
import { ISendMethod, SendMethodDestination, SendMethodType } from '@merit/common/models/send-method';
import { AddressService } from '@merit/common/services/address.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';

const ERROR_ADDRESS_NOT_CONFIRMED = 'ADDRESS_NOT_CONFIRMED';
const ERROR_ALIAS_NOT_FOUND = 'ALIAS_NOT_FOUND';

@IonicPage()
@Component({
  selector: 'view-send',
  templateUrl: 'send.html'
})
export class SendView {

  @ViewChild(Slides) slides: Slides;
  get sliderIsFinished(): boolean {
    return this.slides.isEnd();
  }

  private recentContacts: Array<MeritContact> = [];
  private suggestedMethod: ISendMethod;
  searchQuery: string = '';
  loadingContacts: boolean;
  contacts: Array<MeritContact> = [];
  amount: number;
  searchResult: {
    withMerit: Array<MeritContact>,
    noMerit: Array<MeritContact>,
    recent: Array<MeritContact>,
    toNewEntity: { destination: string, contact: MeritContact },
    error: string
  } = { withMerit: [], noMerit: [], recent: [], toNewEntity: null, error: null };


  hasUnlockedWallets: boolean;
  hasActiveInvites: boolean;
  showSlider: boolean;

  searchInProgress: boolean;

  constructor(private navCtrl: NavController,
    private contactsService: ContactsService,
    private profileService: ProfileService,
    private addressService: AddressService,
    private modalCtrl: ModalController,
    private addressScanner: AddressScannerService,
    private persistenceService: PersistenceService,
    private events: Events,
              private toastCtrl: ToastController
  ) {
  }

  private async updateHasUnlocked() {
    const wallets = await this.profileService.getWallets();
    this.hasUnlockedWallets = wallets.some(w => w.confirmed);
    this.hasUnlockedWallets = true;
    this.hasActiveInvites = wallets.some(w => w.availableInvites > 0);

    let pagesVisited = await this.persistenceService.getPagesVisited();
    this.showSlider = (pagesVisited.indexOf('send') == -1);
    this.showSlider = false; // temporary disabled
  }

  async hideSlider() {
    this.showSlider = false;
    let pagesVisited = await this.persistenceService.getPagesVisited();
    pagesVisited = pagesVisited.filter(p => p != 'send');
    pagesVisited.push('send');
    return this.persistenceService.setPagesVisited(pagesVisited);
  }

  async ionViewWillEnter() {
    this.loadingContacts = true;
    await this.updateHasUnlocked();
    this.contacts = await this.contactsService.getAllMeritContacts();
    this.loadingContacts = false;
    await this.updateRecentContacts();
    return this.parseSearch();

    this.events.subscribe('Remote:IncomingTx', () => {
      this.updateHasUnlocked();
    });
  }


  async updateRecentContacts() {
    const sendHistory = await this.addressService.getSendHistory();
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
    this.searchInProgress = true;
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
        const addressInfo = await this.addressService.getAddressInfo(input);

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
        const addressInfo = await this.addressService.getAddressInfo(input);

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
      }
    }

    this.searchResult = result;
    this.searchInProgress = false;
  }


  private couldBeAlias(input) {
    if (!isAlias(input)) return false;
    return this.addressService.couldBeAlias(input.slice(1));
  }

  private async isValidAddress(input) {
    return await this.addressService.isAddressValid(input);
  }

  private isAddress(input) {
    return this.addressService.isAddress(input);
  }

  onSearchKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 13) (event.target as HTMLInputElement).blur();
  }

  clearSearch() {
    this.searchQuery = '';
    delete this.suggestedMethod;
    if (this.searchResult) {
      delete this.searchResult.toNewEntity;
    }
  }

  addContact() {
    let meritAddress = {
      address: null,
      network: null
    };
    let modal = this.modalCtrl.create('SendCreateContactView');
    modal.onDidDismiss((contact) => {
      this.navCtrl.pop();
    });
    modal.present();
  }
  createContact() {
    let meritAddress = this.searchResult.toNewEntity.contact.meritAddresses[0];
    let modal = this.modalCtrl.create('SendCreateContactView', { address: meritAddress });
    modal.onDidDismiss((contact) => {
      if (contact) {
        this.navCtrl.push('SendAmountView', {
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
    if (contact.meritAddresses.length == 1) {
      return this.navCtrl.push('SendAmountView', {
        contact: contact,
        amount: this.amount,
        suggestedMethod: {
          type: SendMethodType.Classic,
          destination: SendMethodDestination.Address,
          value: contact.meritAddresses[0].address,
          alias: contact.meritAddresses[0].alias
        }
      });
    } else {
      this.modalCtrl.create('SendViaView', {
          contact: contact,
          amount: this.amount
        }, MERIT_MODAL_OPTS
      ).present();
    }
  }
  editContact(contact, $event) {
    $event.stopPropagation();
    this.modalCtrl.create('SendEditContactView', { contact }).present();
  }
  sendToEntity(entity) {
    this.navCtrl.push('SendAmountView', {
      contact: entity.contact,
      amount: this.amount,
      suggestedMethod: {
        type: SendMethodType.Classic,
        destination: SendMethodDestination.Address,
        value: entity.contact.meritAddresses[0].address,
        alias: entity.contact.meritAddresses[0].alias
      }
    });
  }

  async openScanner() {
    this.searchQuery = await this.addressScanner.scanAddress();
    this.parseSearch();
  }

  easySend() {
    if (!this.hasActiveInvites) {
      this.toastCtrl.create({
        message: 'You do not have any available invites to use GlobalSend',
        duration: 4000,
        showCloseButton: true
      });
      return;
    }

    this.navCtrl.push('SendAmountView', {
      suggestedMethod: { type: SendMethodType.Easy }
    });
  }

  slideNext() {
    this.sliderIsFinished ? this.slides.slideNext() : this.hideSlider();
  }

  slidePrev() {
    this.slides.slidePrev();
  }
}
