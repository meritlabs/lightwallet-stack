import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
} from 'ionic-angular';
import { ENV } from '@app/env';
import { ConfigService } from '@merit/common/services/config.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { cleanAddress, isAlias } from '@merit/common/utils/addresses';
import { IMeritToastConfig, ToastControllerService } from '@merit/common/services/toast-controller.service';
import { AddressService } from '@merit/common/services/address.service';
import { PollingNotificationsService } from '@merit/common/services/polling-notification.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressValidator } from '@merit/common/validators/address.validator';
import { PasswordValidator } from '@merit/common/validators/password.validator';
import { AddWalletAction } from '@merit/common/reducers/wallets.reducer';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';
import { createDisplayWallet } from '@merit/common/models/display-wallet';
import { InviteRequestsService } from '@merit/common/services/invite-request.service';
import { TxFormatService } from '@merit/common/services/tx-format.service';
import { PersistenceService2 } from '@merit/common/services/persistence2.service';

@IonicPage({
  defaultHistory: ['WalletsView'],
})
@Component({
  selector: 'view-create-wallet',
  templateUrl: 'create-wallet.html',
})
export class CreateWalletView {

  formData: FormGroup = this.formBuilder.group({
    walletName: ['Personal wallet', Validators.required],
    parentAddress: ['', Validators.required, AddressValidator.validateAddress()],
    alias: ['', [], AddressValidator.validateAliasAvailability],
    bwsurl: [ENV.mwsUrl],
    recoveryPhrase: '',
    password: '',
    repeatPassword: ['', PasswordValidator.MatchPassword],
    color: ['#00B0DD'],
    hideBalance: false,
  });

  get parentAddress() {
    return this.formData.get('parentAddress');
  }

  get alias() {
    return this.formData.get('alias');
  }

  get recoveryPhrase() {
    return this.formData.get('recoveryPhrase');
  }

  get password() {
    return this.formData.get('password');
  }

  get repeatPassword() {
    return this.formData.get('repeatPassword');
  }

  selectedColor = {
    name: 'Merit blue',
    color: '#00B0DD',
  };

  availableColors: any = [
    {
      name: 'Sunglo',
      color: '#E57373',
    },
    {
      name: 'Carissma',
      color: '#E985A7',
    },
    {
      name: 'Light Wisteria',
      color: '#ca85d6',
    },
    {
      name: 'Lilac Bush',
      color: '#A185D4',
    },
    {
      name: 'Merit blue',
      color: '#00B0DD',
    },
    {
      name: 'Moody Blue',
      color: '#7987d1',
    },
    {
      name: 'Havelock Blue',
      color: '#64aae3',
    },
    {
      name: 'Picton Blue',
      color: '#53b9e8',
    },
    {
      name: 'Viking',
      color: '#4ccdde',
    },
    {
      name: 'Ocean Green',
      color: '#48ae6c',
    },
    {
      name: 'Puerto Rico',
      color: '#44baad',
    },
    {
      name: 'Wild Willow',
      color: '#99c666',
    },
    {
      name: 'Turmeric',
      color: '#bcc84c',
    },
    {
      name: 'Buttercup',
      color: '#f5a623',
    },
    {
      name: 'Supernova',
      color: '#ffc30e',
    },
    {
      name: 'Yellow Orange',
      color: '#ffaf37',
    },
    {
      name: 'Portage',
      color: '#8997eb',
    },
    {
      name: 'Gray',
      color: '#808080',
    },
    {
      name: 'Shuttle Gray',
      color: '#5f6c82',
    },
    {
      name: 'Tuna',
      color: '#383d43',
    },
  ];

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private config: ConfigService,
    private walletService: WalletService,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastControllerService,
    private modalCtrl: ModalController,
    private logger: LoggerService,
    private pushNotificationService: PushNotificationsService,
    private pollingNotificationService: PollingNotificationsService,
    private alertCtrl: AlertController,
    private addressService: AddressService,
    private formBuilder: FormBuilder,
    private store: Store<IRootAppState>,
    private inviteRequestsService: InviteRequestsService,
    private txFormatService: TxFormatService,
    private persistenceService2: PersistenceService2,
  ) {
  }

  async ngOnInit() {
    const { parentAddress } = this.navParams.data;

    if (parentAddress) {
      this.parentAddress.setValue(parentAddress);
      this.parentAddress.markAsDirty();
      this.parentAddress.updateValueAndValidity();
    }
  }

  selectColor() {
    let modal = this.modalCtrl.create('SelectColorView', { color: this.formData.get('color').value });
    modal.onDidDismiss((color) => {
      if (color) {
        this.selectedColor = color;
        this.formData.get('color').setValue(color.color);
      }
    });
    modal.present();
  }

  showAliasTooltip() {
    return this.showTooltip('Add an alias',
      'Add alias to your address, so people can recognize you and type something like "@merituser" instead of address.');
  }

  private showTooltip(title, message) {
    return this.alertCtrl.create({
      title, message,
      buttons: ['Got it'],
    }).present();
  }

  async createWallet() {

    const loader = this.loadCtrl.create({
      content: 'Creating wallet',
    });

    await loader.present();
    let {
      walletName: name,
      parentAddress,
      alias,
      bwsurl,
      recoveryPhrase: mnemonic,
      hideBalance,
      password,
      color,
    } = this.formData.getRawValue();

    parentAddress = cleanAddress(parentAddress);
    alias = cleanAddress(alias);

    const opts = {
      name,
      parentAddress,
      alias,
      bwsurl,
      mnemonic,
      networkName: ENV.network,
      m: 1, //todo temp!
      n: 1, //todo temp!
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
        promises.push(this.walletService.encryptWallet(wallet, password));
      }

      if (color) {
        // TODO(ibby): fix this implementation
        const colorOpts = {
          colorFor: {
            [wallet.id]: color,
          },
        };
        promises.push(this.config.set(colorOpts));
      }

      try {
        await Promise.all(promises);
      } catch (e) {
        this.logger.error(e);
        this.toastCtrl.error(e.message || e);
      }

      const displayWallet = await createDisplayWallet(wallet, this.walletService, this.inviteRequestsService, this.txFormatService, this.persistenceService2);
      this.store.dispatch(new AddWalletAction(displayWallet));
      this.navCtrl.pop();
    } catch (err) {
      this.logger.error(err);
      this.toastCtrl.error(err.message || err);
      // TODO: display error to user
    } finally {
      loader.dismiss();
    }
  }
}
