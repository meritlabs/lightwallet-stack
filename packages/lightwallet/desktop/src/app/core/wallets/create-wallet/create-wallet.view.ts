import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { createDisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { AddWalletAction } from '@merit/common/reducers/wallets.reducer';
import { ConfigService } from '@merit/common/services/config.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { AddressService } from '@merit/common/services/address.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { PasswordValidator } from '@merit/common/validators/password.validator';
import { ENV } from '@app/env';
import { Store } from '@ngrx/store';
import { TxFormatService } from '@merit/common/services/tx-format.service';

@Component({
  selector: 'view-create-wallet',
  templateUrl: './create-wallet.view.html',
  styleUrls: ['./create-wallet.view.sass']
})
export class CreateWalletView {

  formData: FormGroup = this.formBuilder.group({
    walletName: ['', Validators.required],
    parentAddress: ['', Validators.required], // TODO(ibby): add parent address validator
    alias: '', // TODO(ibby): add alias validator
    bwsurl: [ENV.mwsUrl, Validators.required],
    recoveryPhrase: '', // TODO(ibby): add mnemonic validator
    password: '',
    repeatPassword: ['', PasswordValidator.MatchPassword],
    color: '',
    hideBalance: false
  });
  wallet: any = {
    color: {
      name: 'Sunglo',
      color: 'rgba(87,182,121, .6)'
    }
  };
  avalibleColors: any = [
    {
      name: 'Sunglo',
      color: '#E57373'
    },
    {
      name: 'Carissma',
      color: '#E985A7'
    },
    {
      name: 'Light Wisteria',
      color: '#ca85d6'
    },
    {
      name: 'Lilac Bush',
      color: '#A185D4'
    },
    {
      name: 'Moody Blue',
      color: '#7987d1'
    },
    {
      name: 'Havelock Blue',
      color: '#64aae3'
    },
    {
      name: 'Picton Blue',
      color: '#53b9e8'
    },
    {
      name: 'Viking',
      color: '#4ccdde'
    },
    {
      name: 'Ocean Green',
      color: '#48ae6c'
    },
    {
      name: 'Puerto Rico',
      color: '#44baad'
    },
    {
      name: 'Wild Willow',
      color: '#99c666'
    },
    {
      name: 'Turmeric',
      color: '#bcc84c'
    },
    {
      name: 'Buttercup',
      color: '#f5a623'
    },
    {
      name: 'Supernova',
      color: '#ffc30e'
    },
    {
      name: 'Yellow Orange',
      color: '#ffaf37'
    },
    {
      name: 'Portage',
      color: '#8997eb'
    },
    {
      name: 'Gray',
      color: '#808080'
    },
    {
      name: 'Shuttle Gray',
      color: '#5f6c82'
    },
    {
      name: 'Tuna',
      color: '#383d43'
    }
  ];
  selectColor($event) {
    this.wallet.color = $event
  }
  constructor(private formBuilder: FormBuilder,
              private walletService: WalletService,
              private config: ConfigService,
              private logger: LoggerService,
              private router: Router,
              private store: Store<IRootAppState>,
              private addressService: AddressService,
              private txFormatService: TxFormatService
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
        // TODO(ibby): fix this implementation here & in mobile version
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

      const displayWallet = await createDisplayWallet(wallet, this.walletService, this.addressService, this.txFormatService);
      this.store.dispatch(new AddWalletAction(displayWallet));

      return this.router.navigateByUrl('/wallets');
    } catch (err) {
      this.logger.error(err);
      // TODO: display error to user
    }
  }
}
