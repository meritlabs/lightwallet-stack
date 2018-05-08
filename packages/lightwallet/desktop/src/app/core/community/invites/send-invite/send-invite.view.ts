import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IDisplayTransaction } from '@merit/common/models/transaction';
import { IRootAppState } from '@merit/common/reducers';

import { ENV } from '@app/env';
import {
  RefreshOneWalletTransactions, selectSentInvites,
  selectTransactionsLoading
} from '@merit/common/reducers/transactions.reducer';
import {
  RefreshOneWalletAction,
  selectInvites,
  selectWalletsWithInvites
} from '@merit/common/reducers/wallets.reducer';
import { AddressService } from '@merit/common/services/address.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { AddressValidator } from '@merit/common/validators/address.validator';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { map, take, tap } from 'rxjs/operators';

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(email).toLowerCase());
}

@Component({
  selector: 'view-send-invite',
  templateUrl: './send-invite.view.html',
  styleUrls: ['./send-invite.view.sass']
})
export class SendInviteView {
  historyLoading$: Observable<boolean> = this.store.select(selectTransactionsLoading);
  history$: Observable<IDisplayTransaction[]> = this.store.select(selectSentInvites);
  availableInvites$: Observable<number> = this.store.select(selectInvites);
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWalletsWithInvites);

  selectedWallet: DisplayWallet;
  hasAWalletWithInvites: boolean;

  formData: FormGroup = this.formBuilder.group({
    address: ['', [Validators.required], [AddressValidator.validateAddress(this.mwcService, true)]]
  });

  showEmailMessage = false;
  emailSubject;
  emailBody;

  get address() { return this.formData.get('address'); }

  constructor(private store: Store<IRootAppState>,
              private formBuilder: FormBuilder,
              private mwcService: MWCService,
              private walletService: WalletService,
              private toastCtrl: ToastControllerService,
              private addressService: AddressService) {}

  async ngOnInit() {
    const wallets = await this.wallets$.pipe(take(1)).toPromise();
    if (this.hasAWalletWithInvites = wallets.length > 0) {
      this.selectedWallet = wallets[0];
      const code = this.selectedWallet.alias || this.selectedWallet.referrerAddress;
      const shareCode = this.selectedWallet.shareCode;
      this.emailSubject = `Merit invite from ${shareCode}`;
      this.emailBody = `${shareCode} invites you to Merit Community. Create your wallet now - ${window.location.origin}?user=${code}`;
    }

    this.formData.valueChanges.subscribe(val => (this.showEmailMessage = validateEmail(val.address)));
  }

  async sendInvite() {
    let { address } = this.formData.getRawValue();
    address = await this.addressService.getAddressInfo(address);

    try {
      await this.walletService.sendInvite(this.selectedWallet.client, address.address);
      this.store.dispatch(new RefreshOneWalletAction(this.selectedWallet.id, {
        skipRewards: true,
        skipAnv: true,
        skipAlias: true,
        skipShareCode: true
      }));

      this.store.dispatch(new RefreshOneWalletTransactions(this.selectedWallet.id));
      this.formData.reset();
      this.toastCtrl.success('Invite has been sent!');
    } catch (e) {
      console.log(e);
      this.toastCtrl.error('Failed to send invite');
    }
  }

  selectWallet(wallet: DisplayWallet) {
    this.selectedWallet = wallet;
  }
}
