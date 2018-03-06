import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ENV } from '@merit/desktop/environments/environment';
import { PasswordValidator } from '@merit/common/validators/password.validator';
import { WalletService } from '@merit/common/services/wallet.service';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { PushNotificationsService } from '../../../../../../common/services/push-notification.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'view-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss']
})
export class CreateWalletComponent {

  formData: FormGroup = this.formBuilder.group({
    walletName: ['', Validators.required],
    parentAddress: ['', Validators.required],
    alias: '', // TODO(ibby): add alias validator
    bwsurl: [ENV.mwsUrl, Validators.required],
    recoveryPhrase: '',
    password: '',
    repeatPassword: ['', PasswordValidator.MatchPassword],
    color: '',
    hideBalance: false
  });

  constructor(private formBuilder: FormBuilder,
              private walletService: WalletService,
              private config: ConfigService,
              private logger: LoggerService,
              private router: Router
              ) {
  }

  async create() {
    console.log('Creating wallet ... ', this.formData.getRawValue());

    const {
      walletName: name,
      parentAddress,
      alias,
      bwsurl,
      recoveryPhrase: mnemonic,
      hideBalance,
      password,
      color
    } = this.formData.getRawValue();

    const opts = {
      name,
      parentAddress,
      alias,
      bwsurl,
      mnemonic,
      networkName: ENV.network,
      m: 1, //todo temp!
      n: 1 //todo temp!
    };


    try {
      const wallet = await this.walletService.createWallet(opts);
      // Subscribe to push notifications or to long-polling for this wallet.
      if (this.config.get().pushNotificationsEnabled) {
        this.logger.info('Subscribing to push notifications for default wallet');
        // this.pushNotificationService.subscribe(wallet);
      } else {
        this.logger.info('Subscribing to long polling for default wallet');
        // this.pollingNotificationService.enablePolling(wallet);
      }

      let promises: Promise<any>[] = [];
      if (hideBalance) {
        promises.push(this.walletService.setHiddenBalanceOption(wallet.id, hideBalance));
      }

      if (password) {
        promises.push(this.walletService.encrypt(wallet, password));
      }

      if (color) {
        const colorOpts = {
          colorFor: {
            [wallet.id]: color
          }
        };
        promises.push(this.config.set(colorOpts));
      }

      try {
        await Promise.all(promises);
      } catch (e) {
        this.logger.error(e);
      }

      this.router.navigateByUrl('/wallets');

    } catch (err) {
      this.logger.error(err);
      // TODO: display error to user
    }
  }
}
