import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { TaskSlug } from '@merit/common/models/goals';
import { IRootAppState } from '@merit/common/reducers';
import { selectWallets } from '@merit/common/reducers/wallets.reducer';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { getShareLink } from '@merit/common/utils/url';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { filter, take } from 'rxjs/operators';
import { SetShareDialogAction } from '@merit/common/reducers/interface-preferences.reducer';
import { SocialSharing } from '@merit/common/services/social-sharing.service';

@Component({
  selector: 'app-share-box',
  templateUrl: './share-box.component.html',
  styleUrls: ['./share-box.component.sass'],
})
export class ShareBoxComponent implements OnInit {
  constructor(private store: Store<IRootAppState>, private toastCtrl: ToastControllerService, private socialSharing: SocialSharing) {}

  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  selectedWallet = {
    id: null,
    name: 'Select wallet',
  };
  shareAlias: string;
  shareLink: string;
  goalIsDone: boolean;
  taskSlug: TaskSlug = TaskSlug.InviteFriends;
  FB;

  shareTitle: string = 'Merit - digital currency for humans.';
  shareText: string = `Merit aims to be the world’s friendliest digital currency, making it dead simple to pay friends, buy goods, and manage your wealth.\n Get wallet now, your activation: `;

  @Output() dismiss: EventEmitter<void> = new EventEmitter<void>();

  async ngOnInit() {
    const wallets: DisplayWallet[] = await this.wallets$
      .pipe(filter((wallets: DisplayWallet[]) => wallets.length > 0), take(1))
      .toPromise();

    if (wallets.length > 0) {
      this.selectedWallet = wallets[0];
      this.selectWallet(wallets[0]);
    }
    this.FB =  await this.socialSharing.authorizeFBSDK();
  }

  selectWallet(wallet: DisplayWallet) {
    this.selectedWallet = wallet;
    this.shareAlias = wallet.alias || wallet.referrerAddress;
    this.shareLink = getShareLink(this.shareAlias);
  }

  onCopy() {
    this.goalIsDone = true;
    this.toastCtrl.success('Share link copied to clipboard!');
  }

  closeWindow() {
    this.store.dispatch(new SetShareDialogAction(false));
  }

  shareFacebook() {
    this.FB.ui({
      method: 'share_open_graph',
      action_type: 'og.shares',
      action_properties: JSON.stringify({
        object : {
          'og:url': `${this.shareLink}`,
          'og:title': `${this.shareTitle}`,
          'og:site_name':'MeritLightWallet',
          'og:description': `${this.shareText} ${this.shareLink}`,
          'og:image': 'https://www.merit.me/uploads/2018/02/17/shareImage.png',
          'og:image:width':'250',
          'og:image:height':'257'
        }
      })
    }, function(response){
      console.debug(response);
    });
  }

  shareTweeter() {
    this._newWindow(`https://twitter.com/intent/tweet?text=${this.shareText} ${this.shareLink}`);    
  }

  mailTo() {
    window.location.href = (`mailto:?subject=${this.shareTitle}&body=${this.shareText} ${this.shareLink}`); 
  }

  private _newWindow(url) {
    window.open(url, '_blank', 'toolbar=0,location=0,menubar=0,width=600,height=500');
  }
}
