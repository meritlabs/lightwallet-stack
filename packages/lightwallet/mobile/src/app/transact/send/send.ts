import { Component, ViewChild } from '@angular/core';
import { ENV } from '@app/env';
import { MeritContact } from '@merit/common/models/merit-contact';
import { ISendMethod, SendMethodDestination, SendMethodType } from '@merit/common/models/send-method';
import { AddressService } from '@merit/common/services/address.service';
import { ContactsService } from '@merit/common/services/contacts.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { RateService } from '@merit/common/services/rate.service';
import { cleanAddress, isAlias } from '@merit/common/utils/addresses';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';
import { AddressScannerService } from '@merit/mobile/app/utilities/import/address-scanner.service';
import { Events, IonicPage, ModalController, NavController, NavParams, Slides, ToastController } from 'ionic-angular';
import * as _ from 'lodash';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { Observable } from 'rxjs';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { Store } from '@ngrx/store';
import { IRootAppState } from '@merit/common/reducers';
import {
  selectConfirmedWallets,
  selectInvites,
  selectWallets,
  selectWalletsLoading,
} from '@merit/common/reducers/wallets.reducer';
import { couldBeAlias, isAddress } from '@merit/common/utils/addresses';
import { getLatestValue } from '@merit/common/utils/observables';
import { map } from 'rxjs/operators';

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

  recentContacts: MeritContact[] = [];
  suggestedMethod: ISendMethod;
  searchQuery: string = '';
  loadingContacts: boolean;
  contacts: MeritContact[] = [];
  amount: number;
  searchResult: {
    contacts: MeritContact[],
    toNewEntity: { destination: string, contact: MeritContact },
    error: string
  } = { contacts: [], toNewEntity: null, error: null };

  showSlider: boolean;

  wallet: DisplayWallet;

  searchInProgress: boolean;

  wallets$: Observable<DisplayWallet[]> = this.store.select(selectConfirmedWallets);
  walletsLoading$: Observable<boolean> = this.store.select(selectWalletsLoading);
  invites$: Observable<number> = this.store.select(selectInvites);
  hasUnlockedWallets$: Observable<boolean> = this.wallets$.pipe(
    map(wallets => wallets.length > 0)
  );
  hasAvailableInvites$: Observable<boolean> = this.invites$.pipe(
    map(invites => invites > 0)
  );

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private contactsService: ContactsService,
              private profileService: ProfileService,
              private addressService: AddressService,
              private modalCtrl: ModalController,
              private addressScanner: AddressScannerService,
              private persistenceService: PersistenceService,
              private events: Events,
              private toastCtrl: ToastController,
              private rateService: RateService,
              private store: Store<IRootAppState>,
  ) {}

  async hideSlider() {
    this.showSlider = false;
    let pagesVisited = await this.persistenceService.getPagesVisited();
    pagesVisited = pagesVisited.filter(p => p != 'send');
    pagesVisited.push('send');
    return this.persistenceService.setPagesVisited(pagesVisited);
  }

  async ionViewWillEnter() {
    this.wallet = this.navParams.data.wallet;

    this.loadingContacts = true;

    // let pagesVisited = await this.persistenceService.getPagesVisited();
    // this.showSlider = (pagesVisited.indexOf('send') == -1);
    // this.showSlider = false; // temporary disabled

    this.contacts = await this.contactsService.getAllMeritContacts();
    this.loadingContacts = false;
    await this.updateRecentContacts();
    await  this.parseSearch();
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
    const result = { contacts: [], toNewEntity: null, error: null };

    if (!this.searchQuery || !this.searchQuery.length) {
      this.clearSearch();
      this.debounceSearch.cancel();
      this.searchInProgress = false;
      result.contacts = this.contacts;
      return this.searchResult = result;
    }

    if (this.searchQuery.length > 6 && this.searchQuery.indexOf('merit:') == 0) {
      this.searchQuery = this.searchQuery.split('merit:')[1];
    }

    if (this.searchQuery.indexOf('micros') != -1) {
      let microsStr: string = this.searchQuery.split('?micros=')[1];
      this.searchQuery = this.searchQuery.split('?micros=')[0];
      this.amount = +microsStr;
    } else {
      this.amount = null;
    }

    this.debounceSearch();
  }

  private debounceSearch = _.debounce(() => this.search(), 500);


  /**
   * Search users based on searchQuery
   * Looks both for contact list and for address/alias
   */
  private async search() {

    const result = { contacts: [], toNewEntity: null, error: null };

    let input = cleanAddress(this.searchQuery.split('?')[0]);

    if (couldBeAlias(input) || isAddress(input)) {
      let addressInfo = await this.addressService.getAddressInfo(input);
      if (addressInfo && addressInfo.isConfirmed) {
        result.toNewEntity = { destination: SendMethodDestination.Address, contact: new MeritContact() };
        result.toNewEntity.contact.meritAddresses.push({
          address: addressInfo.address,
          alias: addressInfo.alias,
          network: ENV.network
        });
      }
    }

    result.contacts = this.contacts.filter(contact =>
      _.some(contact.meritAddresses, (meritAddress) => {
        if (meritAddress.address == input) return true;
        return (meritAddress.alias && meritAddress.alias.match(input));
      })
    );

    this.searchResult = result;
    this.searchInProgress = false;
  }

  isInputAlias() {
    let input = cleanAddress(this.searchQuery.split('?')[0]);
    this.addressService.couldBeAlias(input);
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
    modal.onDidDismiss(async (contact) => {
      if (contact) {
        this.navCtrl.push('SendAmountView', {
          contact: contact,
          amount: this.amount,
          isEasyEnabled: await getLatestValue(this.hasAvailableInvites$),
          suggestedMethod: {
            type: SendMethodType.Classic,
            destination: SendMethodDestination.Address,
            value: meritAddress.address,
            alias: meritAddress.alias
          }
        });
      }
    });
    modal.present();
  }

  bindAddressToContact() {
    const meritAddress = this.searchResult.toNewEntity.contact.meritAddresses[0];
    const modal = this.modalCtrl.create('SendSelectBindContactView', { contacts: this.contacts, address: meritAddress });
    modal.onDidDismiss((contact) => {
      if (contact) {
        this.navCtrl.push('SendViaView', {
          contact: contact,
          amount: this.amount,
          suggestedMethod: {
            type: SendMethodType.Classic,
            destination: SendMethodDestination.Address,
            value: meritAddress.address,
            alias: meritAddress.alias
          }
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
      const modal = this.modalCtrl.create('SendViaView', {
          contact: contact,
          amount: this.amount
        }, MERIT_MODAL_OPTS
      );

      modal.onDidDismiss((params) => {
        if (params) {
          params.amount = this.amount;
          params.wallet = this.wallet;
          this.navCtrl.push('SendAmountView', params);
        }
      });

      modal.present();
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

  async easySend() {
    // if (!getLatestValue(this.hasAvailableInvites$)) {
    //   this.toastCtrl.create({
    //     message: 'You do not have any available invites to use MeritMoney',
    //     duration: 4000,
    //     showCloseButton: true
    //   });
    //   return;
    // }
    return this.navCtrl.push('SendAmountView', {
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
