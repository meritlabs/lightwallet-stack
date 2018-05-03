import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AddressScannerService } from '@merit/mobile/app/utilities/import/address-scanner.service';
import * as _ from 'lodash';
import { ENV } from '@app/env';
import { MeritContact } from '@merit/common/models/merit-contact';
import { ContactsService } from '@merit/common/services/contacts.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { cleanAddress, isAlias } from '@merit/common/utils/addresses';
import { AddressService } from '@merit/common/services/address.service';
import { ToastControllerService, IMeritToastConfig } from '@merit/common/services/toast-controller.service';
import { SendMethodDestination } from '@merit/common/models/send-method';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ProfileService } from '@merit/common/services/profile.service';

const ERROR_ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND';
const ERROR_ALIAS_NOT_FOUND = 'ALIAS_NOT_FOUND';

@IonicPage()
@Component({
  selector: 'view-send-invite',
  templateUrl: 'send-invite.html'
})
export class SendInviteView {
  searchQuery: string = '';
  loadingContacts: boolean = false;
  contacts: Array<MeritContact> = [];
  amount: number;
  availableInvites;
  searchInProgress: boolean;
  searchResult: {
    withMerit: Array<MeritContact>,
    toNewEntity: { destination: string, contact: MeritContact },
    error: string
  } = { withMerit: [], toNewEntity: null, error: null };

  private wallets: Array<MeritWalletClient>;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private contactsService: ContactsService,
              private addressService: AddressService,
              private modalCtrl: ModalController,
              private addressScanner: AddressScannerService,
              private walletService: WalletService,
              private profileService: ProfileService,
              private toastCtrl: ToastControllerService,
              private loadCtrl: LoadingController
  ) {
  }

  async ionViewWillEnter() {
    this.wallets = await this.profileService.getWallets();
    this.loadingContacts = true;
    this.contacts = await this.contactsService.getAllMeritContacts();
    this.loadingContacts = false;
    this.parseSearch();
    if (this.wallets) {
      this.availableInvites = this.wallets.reduce((nbInvites, wallet) => {
        return nbInvites + wallet.availableInvites
      }, 0);
    }
  }

  async parseSearch() {
    this.searchInProgress = true;
    let result = { withMerit: [], toNewEntity: null, error: null };

    if (!this.searchQuery || !this.searchQuery.length) {
      this.clearSearch();
      this.debounceSearch.cancel();
      result.withMerit = this.contacts;
      return this.searchResult = result;
      this.searchInProgress = false;
    }

    if (this.searchQuery.length > 6 && this.searchQuery.indexOf('merit:') == 0)
      this.searchQuery = this.searchQuery.split('merit:')[1];

    this.debounceSearch();
  }

  private debounceSearch = _.debounce(() => this.search(), 500);

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
        result.toNewEntity.contact.meritAddresses.push({ input, address: addressInfo.address, network: ENV.network });
      }
    }

    this.contactsService.searchContacts(this.contacts, input)
      .forEach((contact: MeritContact) => {
        if (!_.isEmpty(contact.meritAddresses)) {
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
    modal.onDidDismiss((contact) => {
      if (contact) {
        return this.sendInvite(this.searchResult.toNewEntity.contact);
      }
    });
    modal.present();
  }

  bindAddressToContact() {
    const address = this.searchResult.toNewEntity.contact.meritAddresses[0];
    const modal = this.modalCtrl.create('SendSelectBindContactView', { contacts: this.contacts, address });
    modal.onDidDismiss((contact) => {
      if (contact) {
        return this.sendInvite(this.searchResult.toNewEntity.contact);
      }
    });
    modal.present();
  }

  async openScanner() {
    this.searchQuery = await this.addressScanner.scanAddress();
    this.parseSearch();
  }

  async sendInvite(contact) {

    const toAddress = contact.meritAddresses[0].address;

    let wallet = this.wallets.find(w => (w.availableInvites > 0));
    if (!wallet) {
      return this.toastCtrl.error('You have no active invites');
    }

    let loader = this.loadCtrl.create({ content: 'Sending invite...' });
    try {
      loader.present();
      await this.walletService.sendInvite(wallet, toAddress);
      return this.navCtrl.pop();
    } catch (e) {
      console.log(e);
      this.toastCtrl.error('Failed to send invite');
    } finally {
      loader.dismiss();
    }

  }

  onSearchKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 13) (event.target as HTMLInputElement).blur();
  }
}
