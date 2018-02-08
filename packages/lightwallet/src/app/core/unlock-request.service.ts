import { Injectable } from '@angular/core';
import { ProfileService } from 'merit/core/profile.service';
import { PersistenceService } from 'merit/core/persistence.service';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { WalletService } from 'merit/wallets/wallet.service';
import { MeritContact } from '../../models/merit-contact';
import { ContactsProvider } from '../../providers/contacts/contacts';


export interface IUnlockRequest {
    address: string;
    alias: string;
    isConfirmed: boolean;
    referralId: string;
    walletClient: MeritWalletClient;
    contact: MeritContact
}

@Injectable()
export class UnlockRequestService {

    public hiddenAddresses: Array<string>;

    public activeRequestsNumber:number;
    public hiddenRequests: Array<IUnlockRequest> = [];
    public confirmedRequests: Array<IUnlockRequest> = [];
    public activeRequests: Array<IUnlockRequest> = [];

    constructor(
        private profileService: ProfileService,
        private persistenseService: PersistenceService,
        private walletService: WalletService,
        private contactsService: ContactsProvider
    ) {
    }

    //todo subscribe to new block event, then update info
    public async loadRequestsData() {

        this.hiddenAddresses = await this.persistenseService.getHiddenUnlockRequestsAddresses();
        this.activeRequestsNumber = await this.persistenseService.getActiveRequestsNumber();
        let knownContacts = await this.contactsService.getAllMeritContacts();

        //updating it from server
        let requests = {hidden: [], active: [], confirmed: []};
        for (let wallet of await this.profileService.getWallets()) {
            for (let request of await this.walletService.getUnlockRequests(wallet)) {
                request.walletClient = wallet;
                if (request.isConfirmed) {
                    let foundContacts = this.contactsService.searchContacts(knownContacts, request.address);
                    if (foundContacts.length) {
                        request.contact = foundContacts[0];
                    }
                    requests.confirmed.push(request);
                } else if (this.hiddenAddresses.indexOf(request.address) != -1) {
                    requests.hidden.push(request);
                } else {
                    requests.active.push(request);
                }
            }
        }
        this.hiddenRequests = requests.hidden;
        this.activeRequests = requests.active;
        this.confirmedRequests = requests.confirmed;
        this.activeRequestsNumber =  this.activeRequests.length;
        await this.persistenseService.setActiveRequestsNumber(this.activeRequestsNumber);

        console.log(this.activeRequests, 'ACTIVE REQUESTS');

    }

    public async confirmRequest(request: IUnlockRequest) {
        await this.walletService.sendInvite(request.walletClient, request.address);
        request.isConfirmed = true;

        this.hiddenAddresses = this.hiddenAddresses.filter(a => a != request.address);
        await this.persistenseService.setHiddenUnlockRequestsAddresses(this.hiddenAddresses);

        this.hiddenRequests = this.hiddenRequests.filter(r => r.address != request.address);
        this.activeRequests = this.activeRequests.filter(r => r.address != request.address);
        this.confirmedRequests = this.confirmedRequests.filter(r => r.address != request.address);

        this.confirmedRequests.unshift(request);

        this.activeRequestsNumber =  this.activeRequests.length;
        await this.persistenseService.setActiveRequestsNumber(this.activeRequestsNumber);
    }

    public async hideRequest(request: IUnlockRequest) {
        this.hiddenAddresses = this.hiddenAddresses.filter(a => a != request.address);
        this.hiddenAddresses.unshift(request.address);
        await this.persistenseService.setHiddenUnlockRequestsAddresses(this.hiddenAddresses);

        this.hiddenRequests = this.hiddenRequests.filter(r => r.address != request.address);
        this.activeRequests = this.activeRequests.filter(r => r.address != request.address);
        this.confirmedRequests = this.confirmedRequests.filter(r => r.address != request.address);
        this.hiddenRequests.unshift(request);

        this.activeRequestsNumber =  this.activeRequests.length;
        await this.persistenseService.setActiveRequestsNumber(this.activeRequestsNumber);
    }

}
