import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { ENV } from '@app/env';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { IRootAppState } from '@merit/common/reducers';
import { UpdateAppAction } from '@merit/common/reducers/app.reducer';
import { RefreshWalletsAction } from '@merit/common/reducers/wallets.reducer';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { cleanAddress } from '@merit/common/utils/addresses';
import { AddressValidator } from '@merit/common/validators/address.validator';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { getQueryParam } from '@merit/common/utils/url';
import { AddressService } from '@merit/common/services/address.service';

@Component({
  selector: 'view-unlock',
  templateUrl: './unlock.view.html',
  styleUrls: ['./unlock.view.sass'],
})
export class UnlockComponent {
  formData: FormGroup = this.formBuilder.group({
    inviteCode: [
      '',
      [Validators.required, Validators.minLength(3)],
      [AddressValidator.validateAddress(this.mwcService)],
    ],
    alias: [
      '',
      [Validators.required, Validators.minLength(3)],
      [AddressValidator.validateAliasAvailability(this.mwcService)],
    ],
  });

  easyReceipt: EasyReceipt;
  creatingWallet: boolean;
  showAgreement: boolean;
  showGuide: boolean = !('showGuide' in localStorage && localStorage.getItem('showGuide') === 'false');
  userAgreement: object = {
    activation: false,
    mnemonic: false,
  };
  invite = '';
  currentUnlockDialogStep: number = 0;
  gbsUnlock = false;

  get inviteCode() {
    return this.formData.get('inviteCode');
  }
  get alias() {
    return this.formData.get('alias');
  }

  constructor(
    private formBuilder: FormBuilder,
    private mwcService: MWCService,
    private walletService: WalletService,
    private appSettings: AppSettingsService,
    private pushNotificationsService: PushNotificationsService,
    private logger: LoggerService,
    private router: Router,
    private store: Store<IRootAppState>,
    private easyReceiveService: EasyReceiveService,
    private addressService: AddressService,
    private loadingCtrl: Ng4LoadingSpinnerService,
    private toastCtrl: ToastControllerService
  ) {}

  async ngOnInit() {
    const receipts = await this.easyReceiveService.getPendingReceipts();
    this.easyReceipt = receipts.pop();

    let inviteCode;

    this.gbsUnlock = getQueryParam('source') === 'gbs';

    if (this.easyReceipt) {
      inviteCode = this.easyReceipt.parentAddress;
    } else {
      inviteCode = cleanAddress(getQueryParam('invite'));
      this.invite = this.addressService.couldBeAlias(inviteCode) ? `@${inviteCode}` : inviteCode;
    }

    if (inviteCode) {
      this.formData.controls['inviteCode'].setValue(inviteCode, { onlySelf: true });
      this.formData.controls['inviteCode'].markAsDirty();
      this.showGuide = false;
    }
  }

  hideGuide() {
    this.showGuide = false;
    localStorage.setItem('showGuide', 'false');
  }

  async onSubmit() {
    if (this.creatingWallet) {
      // prevent duplicate submissions
      return;
    }

    this.loadingCtrl.show();
    this.creatingWallet = true;
    let { inviteCode, alias } = this.formData.getRawValue();

    alias = cleanAddress(alias);
    inviteCode = cleanAddress(inviteCode);

    try {
      let win;

      if (this.gbsUnlock) {
        win = window.open('', 'UnlockGBS', 'width=580,height=340,0,status=0,');
      }

      const wallet = await this.walletService.createDefaultWallet(inviteCode, alias);
      this.logger.info('Created a new default wallet!');
      await this.pushNotificationsService.subscribe(wallet);

      // update state to include our new wallet
      this.store.dispatch(new RefreshWalletsAction());

      // update state so we're allowed to access the dashboard
      this.store.dispatch(
        new UpdateAppAction({
          loading: false,
          authorized: true,
        })
      );

      if (this.gbsUnlock && !!win) {
        win.location.href = `${ENV.gbsUrl}/unlock?alias=${wallet.rootAlias}&address=${wallet.rootAddress.toString()}`;
      }

      // good to go
      this.loadingCtrl.hide();
      this.creatingWallet = false;
      this.router.navigateByUrl('/');
    } catch (err) {
      this.creatingWallet = false;
      this.loadingCtrl.hide();
      this.logger.debug('Could not unlock wallet: ', err);
      this.toastCtrl.error(err);
      // TODO show  error to user
    }
  }

  declineMeritMoney() {
    this.loadingCtrl.show();
    this.easyReceiveService.deletePendingReceipt(this.easyReceipt).then(() => {
      this.router.navigateByUrl('onboarding');
      this.loadingCtrl.hide();
    });
  }
  unlockStep(dir) {
    let inc = dir === 'next' ? 1 : -1;
    this.currentUnlockDialogStep += inc;

    if (this.gbsUnlock && this.currentUnlockDialogStep === 1) {
      this.currentUnlockDialogStep += inc;
    }

    if (this.currentUnlockDialogStep < 0) {
      this.showAgreement = false;
      this.currentUnlockDialogStep = 0;
    }
  }
}
