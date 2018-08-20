import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { getEasySendURL } from '@merit/common/models/easy-send';
import { SendMethodType } from '@merit/common/models/send-method';
import { IRootAppState } from '@merit/common/reducers';
import { RefreshOneWalletTransactions } from '@merit/common/reducers/transactions.reducer';
import {
  RefreshOneWalletAction,
  selectInvites,
  selectWalletsWithInvites
} from '@merit/common/reducers/wallets.reducer';
import { AddressService } from '@merit/common/services/address.service';
import { AlertService } from '@merit/common/services/alert.service';
import { EasySendService } from '@merit/common/services/easy-send.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { accessWallet, WalletService } from '@merit/common/services/wallet.service';
import { cleanAddress } from '@merit/common/utils/addresses';
import { getSendMethodDestinationType } from '@merit/common/utils/destination';
import { getShareLink } from '@merit/common/utils/url';
import { SendValidator } from '@merit/common/validators/send.validator';
import { InviteValidator } from '@merit/common/validators/invite.validator';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { Store } from '@ngrx/store';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { filter, take, tap } from 'rxjs/operators';

@Component({
  selector: 'view-send-invite',
  templateUrl: './send-invite.view.html',
  styleUrls: ['./send-invite.view.sass']
})
export class SendInviteView {
  availableInvites$: Observable<number> = this.store.select(selectInvites);
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWalletsWithInvites);

  selectedWallet: DisplayWallet;
  hasAWalletWithInvites: boolean;

  formData: FormGroup = this.formBuilder.group({
    address: ['', [], [SendValidator.validateAddress(this.mwcService, true)]],
    type: ['easy'],
    password: [''],
    wallet: [null],
    destination: ['', SendValidator.validateGlobalSendDestination],
    amount: [1, [Validators.required, SendValidator.validateAmount, InviteValidator.InviteQuantityValidator]],
  });

  emailSubject;
  emailBody;

  success: boolean;
  easySendUrl: string;
  easySendDelivered: boolean;

  get address() { return this.formData.get('address'); }
  get type() { return this.formData.get('type'); }
  get destination() { return this.formData.get('destination'); }
  get amount() { return this.formData.get('amount'); }

  constructor(private store: Store<IRootAppState>,
              private formBuilder: FormBuilder,
              private mwcService: MWCService,
              private walletService: WalletService,
              private toastCtrl: ToastControllerService,
              private addressService: AddressService,
              private loader: Ng4LoadingSpinnerService,
              private easySendService: EasySendService,
              private logger: LoggerService,
              private alertCtrl: AlertService) {}

  async ngOnInit() {
    const wallets: DisplayWallet[] = await this.wallets$.pipe(filter((wallets: DisplayWallet[]) => wallets.length > 0), take(1)).toPromise();

    if (this.hasAWalletWithInvites = wallets.length > 0) {
      this.selectWallet(wallets[0]);
      this.formData.get("wallet").setValue(this.selectedWallet);
      const code = this.selectedWallet.alias || this.selectedWallet.referrerAddress;
      this.emailSubject = `Merit invite from ${code}`;
      this.emailBody = `${ code } invites you to Merit Community. Create your wallet now - ${ getShareLink(code) }`;
    }

    // this.formData.valueChanges.subscribe(val => (this.showEmailMessage = validateEmail(val.address)));

    this.type.valueChanges.pipe(
      filter((value: string) => (value === 'easy' && this.address.invalid) || (value === 'classic' && this.address.valid && !this.address.value)),
      tap(() => this.address.updateValueAndValidity({ onlySelf: false }))
    ).subscribe();
  }

  @accessWallet
  async sendInvite(wallet: MeritWalletClient) {
    this.easySendUrl = this.easySendDelivered = this.success = void 0;
    this.loader.show();

    try {
      let { address, type, password, destination, amount } = this.formData.getRawValue();

      if (type === SendMethodType.Easy) {
        const easySend = await this.walletService.sendMeritInvite(wallet, amount, password);
        this.easySendUrl = getEasySendURL(easySend);

        const destinationType = getSendMethodDestinationType(destination);

        if (destination && destinationType) {
          try {
            await wallet.deliverGlobalSend(easySend, {
              type: SendMethodType.Easy,
              destination: destinationType,
              value: destination
            });

            this.easySendDelivered = true;
          } catch (err) {
            this.logger.error('Unable to deliver GlobalSend', err);
            this.easySendDelivered = false;
          }
        }

      } else {
        address = cleanAddress(address);
        address = await this.addressService.getAddressInfo(address);

        await this.walletService.sendInvite(wallet, address.address, amount);
      }

      this.success = true;

      this.store.dispatch(new RefreshOneWalletAction(this.selectedWallet.id, {
        skipRewards: true,
        skipAnv: true,
        skipAlias: true,
        skipShareCode: true
      }));

      this.store.dispatch(new RefreshOneWalletTransactions(this.selectedWallet.id));
      this.address.reset();
      this.formData.markAsPristine();
      this.toastCtrl.success('Invite has been sent!');
    } catch (e) {
      console.log(e);
      this.toastCtrl.error(e.message || 'Failed to send invite');
    } finally {
      this.loader.hide();
    }
  }

  selectWallet(wallet: DisplayWallet) {
    this.selectedWallet = wallet;
    this.formData.get('wallet').setValue(wallet);
    this.formData.get('amount').updateValueAndValidity({ onlySelf: false });
  }

  onGlobalSendCopy() {
    this.toastCtrl.success('Copied to clipboard');
  }
}
