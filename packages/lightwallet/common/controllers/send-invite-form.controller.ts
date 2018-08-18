import { IRootAppState } from '@merit/common/reducers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
  RefreshOneWalletAction,
  selectInvites,
  selectWalletsWithInvites,
} from '@merit/common/reducers/wallets.reducer';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { SendValidator } from '@merit/common/validators/send.validator';
import { InviteValidator } from '@merit/common/validators/invite.validator';
import { filter, take, tap } from 'rxjs/operators';
import { accessWallet, WalletService } from '@merit/common/services/wallet.service';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { SendMethodType } from '@merit/common/models/send-method';
import { getEasySendURL } from '@merit/common/models/easy-send';
import { getSendMethodDestinationType } from '@merit/common/utils/destination';
import { cleanAddress, getAddressInfo } from '@merit/common/utils/addresses';
import { RefreshOneWalletTransactions } from '@merit/common/reducers/transactions.reducer';
import { LoggerService } from '@merit/common/services/logger.service';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { LoadingControllerService } from '@merit/common/services/loading-controller.service';
import { AlertService } from '@merit/common/services/alert.service';

export class SendInviteFormController {
  availableInvites$: Observable<number> = this.store.select(selectInvites);
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWalletsWithInvites);

  hasAWalletWithInvites: boolean;

  formData: FormGroup = this.formBuilder.group({
    address: ['', [], [SendValidator.validateAddress(true)]],
    type: ['easy'],
    password: [''],
    wallet: [null],
    destination: ['', SendValidator.validateGlobalSendDestination],
    amount: [1, [Validators.required, SendValidator.validateAmount, InviteValidator.InviteQuantityValidator]],
  });

  success: boolean;
  easySendUrl: string;
  easySendDelivered: boolean;

  get selectedWallet(): DisplayWallet {
    return this.formData.get('wallet').value;
  }

  get address() {
    return this.formData.get('address');
  }

  get type() {
    return this.formData.get('type');
  }

  get destination() {
    return this.formData.get('destination');
  }

  get amount() {
    return this.formData.get('amount');
  }

  get wallet() {
    return this.formData.get('wallet');
  }

  constructor(
    public store: Store<IRootAppState>,
    protected formBuilder: FormBuilder,
    protected walletService: WalletService,
    protected logger: LoggerService,
    protected toastCtrl: ToastControllerService,
    protected loadingCtrl: LoadingControllerService,
    protected alertCtrl: AlertService,
  ) {
  }

  async init() {
    const wallets: DisplayWallet[] = await this.wallets$.pipe(filter((wallets: DisplayWallet[]) => wallets.length > 0), take(1)).toPromise();

    if (this.hasAWalletWithInvites = wallets.length > 0) {
      this.selectWallet(wallets[0]);
    }

    this.type.valueChanges.pipe(
      filter((value: string) => (value === 'easy' && this.address.invalid) || (value === 'classic' && this.address.valid && !this.address.value)),
      tap(() => this.address.updateValueAndValidity({ onlySelf: false })),
    ).subscribe();
  }

  submit() {
    return this.sendInvite(this.selectedWallet.client);
  }

  @accessWallet
  async sendInvite(wallet: MeritWalletClient) {
    this.easySendUrl = this.easySendDelivered = this.success = void 0;
    this.loadingCtrl.show();

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
              value: destination,
            });

            this.easySendDelivered = true;
          } catch (err) {
            this.logger.error('Unable to deliver GlobalSend', err);
            this.easySendDelivered = false;
          }
        }

      } else {
        address = cleanAddress(address);
        address = await getAddressInfo(address);

        await this.walletService.sendInvite(wallet, address.address, amount);
      }

      this.success = true;

      this.store.dispatch(new RefreshOneWalletAction(this.selectedWallet.id, {
        skipRewards: true,
        skipAnv: true,
        skipAlias: true,
        skipShareCode: true,
      }));

      this.store.dispatch(new RefreshOneWalletTransactions(this.selectedWallet.id));
      this.address.reset();
      this.formData.markAsPristine();
      this.toastCtrl.success('Invite has been sent!');
    } catch (e) {
      console.log(e);
      this.toastCtrl.error(e.message || 'Failed to send invite');
    } finally {
      this.loadingCtrl.hide();
    }
  }

  selectWallet(wallet: DisplayWallet) {
    this.wallet.setValue(wallet);
    this.amount.updateValueAndValidity({ onlySelf: false });
  }

  onGlobalSendCopy() {
    this.toastCtrl.success('Copied to clipboard');
  }
}
