import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppSettingsService } from '@merit/common/services/app-settings.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { MWCService } from '@merit/common/services/mwc.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { isAlias } from '@merit/common/utils/addresses';
import { AddressValidator } from '@merit/common/validators/address.validator';

@Component({
  selector: 'view-unlock',
  templateUrl: './unlock.component.html',
  styleUrls: ['./unlock.component.sass']
})
export class UnlockComponent {
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
              private router: Router
              ) {}

  async onSubmit() {
    let { inviteCode, alias } = this.formData.getRawValue();

    inviteCode = isAlias(inviteCode) ? inviteCode.slice(1) : inviteCode;
    alias = alias && isAlias(alias) ? alias.slice(1) : alias;

    try {
      const wallet = await this.walletService.createDefaultWallet(inviteCode, alias);
      this.logger.info('Created a new default wallet!');
      await this.pushNotificationsService.subscribe(wallet);

      // good to go
      this.router.navigateByUrl('/');
    } catch (err) {
      this.logger.debug('Could not unlock wallet: ', err);
      // TODO show  error to user
    }
  }
}
