import { Injectable } from '@angular/core';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { ProfileService } from '@merit/common/services/profile.service';
import { PersistenceService } from '@merit/common/services/persistence.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { ContactsService } from '@merit/common/services/contacts.service';
import { MeritContact } from '@merit/common/models/merit-contact';
import { DisplayWallet } from '@merit/common/models/display-wallet';

export interface IUnlockRequest {
  address: string;
  alias: string;
  isConfirmed: boolean;
  referralId: string;
  rId: string;
  wallet: DisplayWallet;
  walletClient: MeritWalletClient;
  contact: MeritContact;
  label: string;
  isVault: boolean;
  isNew: boolean;
}

@Injectable()
export class UnlockRequestService {
  hiddenAddresses: Array<string>;
  activeRequestsNumber: number;
  hiddenRequests: Array<IUnlockRequest> = [];
  confirmedRequests: Array<IUnlockRequest> = [];
  activeRequests: Array<IUnlockRequest> = [];

  constructor(
    private profileService: ProfileService,
    private persistenseService: PersistenceService,
    private walletService: WalletService,
    private contactsService: ContactsService,
  ) {}

  //todo subscribe to new block event, then update info
  async loadRequestsData() {
    this.hiddenAddresses = await this.persistenseService.getHiddenUnlockRequestsAddresses();
    this.activeRequestsNumber = await this.persistenseService.getActiveRequestsNumber();
    let knownContacts = await this.contactsService.getAllMeritContacts();

    //updating it from server
    let requests = { hidden: [], active: [], confirmed: [] };

    const wallets = await this.profileService.getWallets();
    const updateWallets = requests =>
      wallets.map(async w => {
        const rqs = await w.getUnlockRequests();
        rqs.forEach(request => {
          request.walletClient = w;
          if (request.isConfirmed) {
            request.status = 'accepted';
            const foundContacts = this.contactsService.searchContacts(knownContacts, request.address);
            if (foundContacts.length) {
              request.contact = foundContacts[0];
            }
            requests.confirmed.push(request);
          } else if (this.hiddenAddresses.indexOf(request.address) != -1) {
            request.status = 'hidden';
            requests.hidden.push(request);
          } else {
            request.status = 'pending';
            requests.active.push(request);
          }
        });
      });

    await Promise.all(updateWallets(requests));

    this.hiddenRequests = requests.hidden;
    this.activeRequests = requests.active;
    this.confirmedRequests = requests.confirmed;
    this.activeRequestsNumber = this.activeRequests.length;
    await this.persistenseService.setActiveRequestsNumber(this.activeRequestsNumber);
  }

  async confirmRequest(request) {
    this.walletService.sendInvite(request.walletClient, request.address);
    request.isConfirmed = true;

    this.hiddenAddresses = this.hiddenAddresses.filter(a => a != request.address);
    await this.persistenseService.setHiddenUnlockRequestsAddresses(this.hiddenAddresses);

    this.hiddenRequests = this.hiddenRequests.filter(r => r.address != request.address);
    this.activeRequests = this.activeRequests.filter(r => r.address != request.address);
    this.confirmedRequests = this.confirmedRequests.filter(r => r.address != request.address);

    this.confirmedRequests.unshift(request);

    this.activeRequestsNumber = this.activeRequests.length;
    await this.persistenseService.setActiveRequestsNumber(this.activeRequestsNumber);
  }

  async hideRequest(request: IUnlockRequest) {
    this.hiddenAddresses = this.hiddenAddresses.filter(a => a != request.address);
    this.hiddenAddresses.unshift(request.address);
    await this.persistenseService.setHiddenUnlockRequestsAddresses(this.hiddenAddresses);

    this.hiddenRequests = this.hiddenRequests.filter(r => r.address != request.address);
    this.activeRequests = this.activeRequests.filter(r => r.address != request.address);
    this.confirmedRequests = this.confirmedRequests.filter(r => r.address != request.address);
    this.hiddenRequests.unshift(request);

    this.activeRequestsNumber = this.activeRequests.length;
    await this.persistenseService.setActiveRequestsNumber(this.activeRequestsNumber);
  }
}
