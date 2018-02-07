import { Component, SecurityContext } from '@angular/core';
import { IonicPage, NavParams, ModalController, LoadingController, NavController } from 'ionic-angular';
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
import { UnlockRequestService, IUnlockRequest } from 'merit/core/unlock-request.service';



@IonicPage()
@Component({
  selector: 'view-unlock-requests',
  templateUrl: 'unlock-requests.html',
})
export class UnlockRequestsView {
  
  hiddenRequests: IUnlockRequest[] = []; 
  confirmedRequests: IUnlockRequest[] = [];
  activeRequests: IUnlockRequest[] = [];

  private wallets: Array<IDisplayWallet> = [];
  private totalInvites: number = 0;

  showHiddenRequests: boolean;

  private knownContacts: Array<MeritContact>;
  
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private profileService: ProfileService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private addressBook: AddressBookService,
    private sanitizer: DomSanitizer,
    private unlockRequestService: UnlockRequestService
  ) {
    
    this.hiddenRequests = this.unlockRequestService.hiddenRequests;
    this.activeRequests = this.unlockRequestService.activeRequests;
    this.confirmedRequests  = this.unlockRequestService.confirmedRequests;

    this.wallets = navParams.get('wallets');
  }

  async ionViewWillEnter() {

    this.totalInvites = this.wallets.reduce((nbInvites, wallet) => {
        return nbInvites += wallet.invites;
    }, 0);  

  }

  processRequest(request) {
    this.navCtrl.push('IncomingRequestModal', {request: request});

    // if (!this.totalInvites) {
    //   return this.toastCtrl.create({
    //     message: "You dont't have any invites you can spend now",
    //     position: ToastConfig.POSITION,
    //     duration: ToastConfig.DURATION,
    //     cssClass: ToastConfig.CLASS_ERROR
    //   }).present();
    // }

    // const modal = this.modalCtrl.create('IncomingRequestModal', {
    //   request: request,
    //   wallets: this.wallets
    // }, MERIT_MODAL_OPTS);
    // modal.onDidDismiss((request) => {
    //   if (request) {
    //     if (request.isConfirmed) {
    //        this.confirmRequest(request);
    //     } else {
    //        this.hideRequest(request);
    //     }       
    //   }
    // });
    // return modal.present();
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
