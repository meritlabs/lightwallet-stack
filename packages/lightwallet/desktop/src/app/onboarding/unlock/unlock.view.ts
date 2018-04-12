import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { isAlias } from '@merit/common/utils/addresses';
import { AddressValidator } from '@merit/common/validators/address.validator';
import { Store } from '@ngrx/store';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'view-unlock',
  templateUrl: './unlock.view.html',
  styleUrls: ['./unlock.view.sass']
})
export class UnlockComponent {
  formData: FormGroup = this.formBuilder.group({
    inviteCode: ['', [Validators.required, Validators.minLength(3)], [AddressValidator.validateAddress(this.mwcService)]],
    alias: ['', Validators.minLength(3), [AddressValidator.validateAliasAvailability(this.mwcService)]]
  });

  easyReceipt: EasyReceipt;
  creatingWallet: boolean = false;


  get inviteCode() { return this.formData.get('inviteCode'); }
  get alias() { return this.formData.get('alias'); }

  constructor(private formBuilder: FormBuilder,
              private mwcService: MWCService,
              private walletService: WalletService,
              private appSettings: AppSettingsService,
              private pushNotificationsService: PushNotificationsService,
              private logger: LoggerService,
              private router: Router,
              private store: Store<IRootAppState>,
              private easyReceiveService: EasyReceiveService,
              private loadingCtrl: Ng4LoadingSpinnerService
              ) {}

  async ngOnInit() {
    const receipts = await this.easyReceiveService.getPendingReceipts();
    this.easyReceipt = receipts.pop();

    if (this.easyReceipt) {
      this.inviteCode.setValue(this.easyReceipt.parentAddress);
    }
  }

  async onSubmit() {
    this.loadingCtrl.show();
    this.creatingWallet = true;
    let { inviteCode, alias } = this.formData.getRawValue();

    inviteCode = isAlias(inviteCode) ? inviteCode.slice(1) : inviteCode;
    alias = alias && isAlias(alias) ? alias.slice(1) : alias;



    try {
      const wallet = await this.walletService.createDefaultWallet(inviteCode, alias);
      this.logger.info('Created a new default wallet!');
      await this.pushNotificationsService.subscribe(wallet);

      // update state to include our new wallet
      this.store.dispatch(new RefreshWalletsAction());

      // update state so we're allowed to access the dashboard
      this.store.dispatch(new UpdateAppAction({
        loading: false,
        authorized: true
      }));

      // good to go
      this.loadingCtrl.hide();
      this.creatingWallet = false;
      this.router.navigateByUrl('/');
    } catch (err) {
      this.creatingWallet = false;
      this.loadingCtrl.hide();
      this.logger.debug('Could not unlock wallet: ', err);
      // TODO show  error to user
    }
  }
}
