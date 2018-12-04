import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { AddressScannerService } from '@merit/mobile/app/utilities/import/address-scanner.service';
import { debounce } from 'lodash';
import { ENV } from '@app/env';
import { MeritContact } from '@merit/common/models/merit-contact';
import { ContactsService } from '@merit/common/services/contacts.service';
import { cleanAddress, isAlias } from '@merit/common/utils/addresses';
import { AddressService } from '@merit/common/services/address.service';
import { SendMethodDestination } from '@merit/common/models/send-method';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { MERIT_MODAL_OPTS } from '@merit/common/utils/constants';

const ERROR_ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND';
const ERROR_ALIAS_NOT_FOUND = 'ALIAS_NOT_FOUND';

@IonicPage()
@Component({
  selector: 'view-send-invite',
  templateUrl: 'send-invite.html',
})
export class SendInviteView {
  searchQuery: string = '';
  loadingContacts: boolean = false;
  contacts: Array<MeritContact> = [];

  searchInProgress: boolean;
  searchResult: {
    withMerit: Array<MeritContact>;
    toNewEntity: { destination: string; contact: MeritContact };
    error: string;
  } = { withMerit: [], toNewEntity: null, error: null };

  constructor(
    private navCtrl: NavController,
    private contactsService: ContactsService,
    private addressService: AddressService,
    private modalCtrl: ModalController,
    private addressScanner: AddressScannerService,
  ) {}

  async ionViewWillEnter() {
    this.loadingContacts = true;
    this.contacts = await this.contactsService.getAllMeritContacts();
    this.loadingContacts = false;
    this.parseSearch();
  }

  async parseSearch() {
    this.searchInProgress = true;
    let result = { withMerit: [], toNewEntity: null, error: null };

    if (!this.searchQuery || !this.searchQuery.length) {
      this.clearSearch();
      this.debounceSearch.cancel();
      result.withMerit = this.contacts;
      return (this.searchResult = result);
      this.searchInProgress = false;
    }

    if (this.searchQuery.length > 6 && this.searchQuery.indexOf('merit:') == 0)
      this.searchQuery = this.searchQuery.split('merit:')[1];

    this.debounceSearch();
  }

  private debounceSearch = debounce(() => this.search(), 500);

  private async search() {
    let result = { withMerit: [], toNewEntity: null, error: null };

    const input = cleanAddress(this.searchQuery.split('?')[0]);

    if (this.addressService.isAddress(input)) {
      let addressInfo = await this.addressService.getAddressInfo(input);

      if (addressInfo.isBeaconed) {
        result.toNewEntity = { destination: SendMethodDestination.Address, contact: new MeritContact() };
        result.toNewEntity.contact.meritAddresses.push({ address: input, network: ENV.network });
      } else {
        result.error = ERROR_ADDRESS_NOT_FOUND;
      }
    } else if (this.addressService.couldBeAlias(input)) {
      const addressInfo = await this.addressService.getAddressInfo(input);

      if (addressInfo && addressInfo.isConfirmed) {
        result.toNewEntity = { destination: SendMethodDestination.Address, contact: new MeritContact() };
        result.toNewEntity.contact.meritAddresses.push({
          alias: input,
          address: addressInfo.address,
          network: ENV.network,
        });
      }
    }

    this.contactsService.searchContacts(this.contacts, input).forEach((contact: MeritContact) => {
      if (contact.meritAddresses && contact.meritAddresses.length) {
        result.withMerit.push(contact);
      }
    });

    this.searchResult = result;
    this.searchInProgress = false;
  }

  clearSearch() {
    this.searchQuery = '';
    if (this.searchResult) {
      delete this.searchResult.toNewEntity;
    }
  }

  createContact() {
    const address = this.searchResult.toNewEntity.contact.meritAddresses[0];
    const modal = this.modalCtrl.create('SendCreateContactView', { address });
    modal.onDidDismiss(contact => {
      if (contact) {
        return this.sendInvite(this.searchResult.toNewEntity.contact);
      }
    });
    modal.present();
  }

  bindAddressToContact() {
    const address = this.searchResult.toNewEntity.contact.meritAddresses[0];
    const modal = this.modalCtrl.create('SendSelectBindContactView', { contacts: this.contacts, address });
    modal.onDidDismiss(contact => {
      if (contact) {
        return this.sendInvite(this.searchResult.toNewEntity.contact);
      }
    });
    modal.present();
  }

  onSearchKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 13) (event.target as HTMLInputElement).blur();
  }

  async openScanner() {
    this.searchQuery = await this.addressScanner.scanAddress();
    this.parseSearch();
  }

  async sendInvite(contact) {
    if (contact.meritAddresses.length == 1) {
      this.toSendAmount(contact.meritAddresses[0].address);
    } else {
      let modal = this.modalCtrl.create(
        'SendViaView',
        {
          contact: contact,
        },
        MERIT_MODAL_OPTS,
      );
      modal.onDidDismiss(params => {
        if (params) {
          this.toSendAmount(params.suggestedMethod.value);
        }
      });
      modal.present();
    }
  }

  private toSendAmount(address) {
    this.navCtrl.push('SendInviteAmountView', { address: address });
  }
}
