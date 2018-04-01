import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IRootAppState } from '@merit/common/reducers';
import { UpdateAppAction } from '@merit/common/reducers/app.reducer';
import { RefreshWalletsAction } from '@merit/common/reducers/wallets.reducer';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { isAlias } from '@merit/common/utils/addresses';
import { AddressValidator } from '@merit/common/validators/address.validator';
import { Store } from '@ngrx/store';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  selector: 'view-unlock',
  templateUrl: './unlock.component.html',
  styleUrls: ['./unlock.component.sass']
})
export class UnlockComponent implements OnInit {
  formData: FormGroup = this.formBuilder.group({
    inviteCode: ['', [Validators.required, Validators.minLength(3)], [AddressValidator.validateAddress(this.mwcService)]],
    alias: ['', Validators.minLength(3), [AddressValidator.validateAliasAvailability(this.mwcService)]]
  });

  get inviteCode() { return this.formData.get('inviteCode'); }
  get alias() { return this.formData.get('alias'); }

  constructor(private formBuilder: FormBuilder,
              private mwcService: MWCService,
              private walletService: WalletService,
              private appSettings: AppSettingsService,
              private pushNotificationsService: PushNotificationsService,
              private logger: LoggerService,
              private router: Router,
              private store: Store<IRootAppState>
              ) {}

  async onSubmit() {
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
      this.router.navigateByUrl('/');
      console.log('done navigating...');
    } catch (err) {
      this.logger.debug('Could not unlock wallet: ', err);
      // TODO show  error to user
    }
  }
  public carouselOne: NgxCarousel;
  ngOnInit() {
    this.carouselOne = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: true
      },
      load: 2,
      touch: true,
      loop: true,
      custom: 'banner'
    }
  }
}
