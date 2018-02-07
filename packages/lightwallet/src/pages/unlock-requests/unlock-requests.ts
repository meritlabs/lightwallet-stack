import { Component, SecurityContext } from '@angular/core';
import { IonicPage, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { ProfileService } from 'merit/core/profile.service';
import { MERIT_MODAL_OPTS } from 'merit/../utils/constants';
import { IDisplayWallet } from 'merit/../models/display-wallet';
import { ToastConfig } from 'merit/core/toast.config';
import { MeritToastController } from 'merit/core/toast.controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { MeritWalletClient } from 'src/lib/merit-wallet-client';
import { AddressBookService } from 'merit/shared/address-book/address-book.service';
import { MeritContact } from 'merit/shared/address-book/merit-contact.model';
import { DomSanitizer } from '@angular/platform-browser';




@IonicPage()
@Component({
  selector: 'view-unlock-requests',
  templateUrl: 'unlock-requests.html',
})
export class UnlockRequestsView {
  requests: IUnlockRequest[] = [];
  hiddenRequests: IUnlockRequest[] = []; 
  confirmedRequests: IUnlockRequest[] = [];
  activeRequests: IUnlockRequest[] = [];

  private wallets: Array<IDisplayWallet> = [];
  private totalInvites: number = 0;

  showHiddenRequests: boolean;

  private knownContacts: Array<MeritContact>;
  
  constructor(
    private navParams: NavParams,
    private profileService: ProfileService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private addressBook: AddressBookService,
    private sanitizer: DomSanitizer
  ) {
    this.requests = navParams.get('invites');
    this.wallets = navParams.get('wallets');
  }

  async ionViewDidLoad() {

    this.totalInvites = this.wallets.reduce((nbInvites, wallet) => {
        console.log(wallet.invites, 'wallet invites');
        return nbInvites += wallet.invites;
    }, 0);

    this.knownContacts = await this.addressBook.getAllMeritContacts();
    
    let hiddenAddresses = await this.profileService.getHiddenUnlockRequestsAddresses();
    this.requests.forEach(r => {

      let foundContacts = this.addressBook.searchContacts(this.knownContacts, r.address).concat(
        this.addressBook.searchContacts(this.knownContacts, r.alias)
      );
      if (foundContacts.length) r.contact = foundContacts[0]; 

      if (r.isConfirmed) return this.confirmedRequests.push(r);
      if (hiddenAddresses.indexOf(r.address) != -1) return this.hiddenRequests.push(r);
      
      return this.activeRequests.push(r);
    });

    

  }

  processRequest(request) {
    if (!this.totalInvites) {
      return this.toastCtrl.create({
        message: "You dont't have any invites you can spend now",
        position: ToastConfig.POSITION,
        duration: ToastConfig.DURATION,
        cssClass: ToastConfig.CLASS_ERROR
      }).present();
    }

    const modal = this.modalCtrl.create('IncomingRequestModal', {
      request: request,
      wallets: this.wallets
    }, MERIT_MODAL_OPTS);
    modal.onDidDismiss((request) => {
      if (request) {
        if (request.isConfirmed) {
           this.confirmRequest(request);
        } else {
           this.hideRequest(request);
        }       
      }
    });
    return modal.present();
  }

  
  private confirmRequest(request:IUnlockRequest) {
      this.hiddenRequests= this.hiddenRequests.filter(r => r.address != request.address); 
      this.activeRequests = this.activeRequests.filter(r => r.address != request.address);
      this.confirmedRequests = this.confirmedRequests.filter(r => r.address != request.address);
      this.confirmedRequests.unshift(request);
  }

  private async hideRequest(request:IUnlockRequest) {
      await this.profileService.hideRequestAddress(request.address);
      this.hiddenRequests = this.hiddenRequests.filter(r => r.address != request.address);
      this.hiddenRequests.unshift(request);
      this.activeRequests = this.activeRequests.filter(r => r.address != request.address); 
  }

  sanitizePhotoUrl(url:string) {
    return this.sanitizer.sanitize(SecurityContext.URL, url);
  }

  getContactInitials(contact) {
    if (!contact.name || !contact.name.formatted) return '';
    let nameParts = contact.name.formatted.toUpperCase().replace(/\s\s+/g, ' ').split(' ');
    let name = nameParts[0].charAt(0);
    if (nameParts[1]) name += ' ' + nameParts[1].charAt(0);
    return name;
  }


}
