import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ENV } from '@app/env';
import { MeritWalletClient } from '@merit/common/merit-wallet-client';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { IRootAppState } from '@merit/common/reducers';
import { selectGoalSettings } from '@merit/common/reducers/goals.reducer';
import { selectShareDialogState, SetShareDialogAction } from '@merit/common/reducers/interface-preferences.reducer';
import { RefreshOneWalletTransactions } from '@merit/common/reducers/transactions.reducer';
import {
  RefreshOneWalletAction,
  selectNumberOfInviteRequests,
  selectWallets,
  selectWalletsLoading,
} from '@merit/common/reducers/wallets.reducer';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { GoalsService } from '@merit/common/services/goals.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { PersistenceService2, UserSettingsKey } from '@merit/common/services/persistence2.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { SmsNotificationsService } from '@merit/common/services/sms-notifications.service';
import { PasswordValidator } from '@merit/common/validators/password.validator';
import { ConfirmDialogControllerService } from '@merit/desktop/app/components/confirm-dialog/confirm-dialog-controller.service';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';
import { SmsNotificationsPromptController } from '@merit/desktop/app/components/sms-notifications-prompt/sms-notifications-prompt.controller';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { ElectronService } from '@merit/desktop/services/electron.service';
import { Store } from '@ngrx/store';
import { Address, PublicKey } from 'meritcore-lib';
import { Observable } from 'rxjs/Observable';
import { filter, map } from 'rxjs/operators';
import { IGoalSettings } from '@merit/common/models/goals';

@Component({
  selector: 'view-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class CoreView implements OnInit, AfterViewInit {
  topMenuItems: any[] = [
    {
      name: 'Dashboard',
      icon: '/assets/v1/icons/ui/aside-navigation/home.svg',
      link: '/dashboard',
    },
    {
      name: 'Invites',
      icon: '/assets/v1/icons/invites/invite.svg',
      link: '/invites',
      badge: this.store.select(selectNumberOfInviteRequests),
    },
    {
      name: 'Wallets',
      icon: '/assets/v1/icons/ui/aside-navigation/wallet.svg',
      link: '/wallets',
    },
    {
      name: 'Receive Merit',
      icon: '/assets/v1/icons/ui/aside-navigation/receive.svg',
      link: '/receive',
    },
    {
      name: 'Send Merit',
      icon: '/assets/v1/icons/ui/aside-navigation/send.svg',
      link: '/send',
    },
    {
      name: 'History',
      icon: '/assets/v1/icons/ui/aside-navigation/history.svg',
      link: '/history',
    },
    {
      name: 'Community',
      icon: '/assets/v1/icons/ui/aside-navigation/network.svg',
      link: '/community',
    },
    {
      name: 'Settings',
      icon: '/assets/v1/icons/ui/aside-navigation/settings.svg',
      link: '/settings',
    },
  ];
  bottomMenuItems: any[] = [
    {
      name: 'Market Beta',
      icon: '/assets/v1/icons/ui/aside-navigation/market.svg',
      link: '/market/gate'
    },
    {
      name: 'Help & Support',
      icon: '/assets/v1/icons/ui/aside-navigation/info.svg',
      link: 'https://www.merit.me/get-involved/#join-the-conversation',
      external: true,
    },
  ];

  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWallets);
  walletsLoading$: Observable<boolean> = this.store.select(selectWalletsLoading);
  recordPassphrase: boolean = true;
  lockedWallets$: Observable<DisplayWallet[]> = this.wallets$.pipe(
    map((wallets: DisplayWallet[]) => wallets.filter((wallet: DisplayWallet) => !wallet.confirmed)),
    map((wallets: DisplayWallet[]) => (wallets && wallets.length ? wallets : null))
  );
  isWelcomeDialogEnabled$: Observable<boolean> = this.store
    .select(selectGoalSettings)
    .pipe(
      filter((goalSettings: IGoalSettings) => !!goalSettings),
      map((goalSettings: IGoalSettings) => goalSettings.isWelcomeDialogEnabled)
    );
  showShare$: Observable<boolean> = this.store.select(selectShareDialogState);

  constructor(
    private pushNotificationsService: PushNotificationsService,
    private easyReceiveService: EasyReceiveService,
    private logger: LoggerService,
    private confirmDialogCtrl: ConfirmDialogControllerService,
    private passwordPromptCtrl: PasswordPromptController,
    private toastCtrl: ToastControllerService,
    private profileService: ProfileService,
    private store: Store<IRootAppState>,
    private persistenceService2: PersistenceService2,
    private domSanitizer: DomSanitizer,
    private smsNotificationsService: SmsNotificationsService,
    private smsNotificationsPromptCtrl: SmsNotificationsPromptController,
    private goalsService: GoalsService
  ) {}

  async ngOnInit() {
    this.recordPassphrase = Boolean(await this.persistenceService2.getUserSettings(UserSettingsKey.recordPassphrase));

    this.processPendingEasyReceipts();
    this.pushNotificationsService.init();
    this.easyReceiveService.cancelEasySendObservable$.subscribe(receipt => {
      this.processEasyReceipt(receipt, null, false, null, true);
    });

    if (ElectronService.isElectronAvailable) {
      this.topMenuItems.splice(this.topMenuItems.length-1, 0,
        {
          name: 'Mining',
          icon: '/assets/v1/icons/ui/aside-navigation/mine.svg',
          link: '/mining'
        });
    }

    const smsPromptSetting = await this.persistenceService2.getUserSettings(UserSettingsKey.SmsNotificationsPrompt);

    if (smsPromptSetting == true) return;

    const smsNotificationStatus = await this.smsNotificationsService.getSmsSubscriptionStatus();

    if (smsNotificationStatus.enabled) return;

    if(this.recordPassphrase) {
      this.smsNotificationsPromptCtrl.create();
    }
  }

  ngAfterViewInit() {
    window.history.replaceState({}, document.title, document.location.pathname);
  }

  getIconStyle(icon: string) {
    return this.domSanitizer.bypassSecurityTrustStyle(
      `mask-image: url('${icon}'); -webkit-mask-image: url('${icon}');`
    );
  }

  onGuideDismiss() {
    this.persistenceService2.setUserSettings(UserSettingsKey.recordPassphrase, (this.recordPassphrase = true));
    this.smsNotificationsPromptCtrl.create();
  }

  shareActivate() {
    this.store.dispatch(new SetShareDialogAction(true));
  }

  private showPasswordEasyReceivePrompt(receipt: EasyReceipt, processAll: boolean, wallet?: MeritWalletClient) {
    const message = `You've received a transaction from ${receipt.senderName}! Please enter password to claim it.`;
    const passwordPrompt = this.passwordPromptCtrl.create(
      message,
      [Validators.required],
      [PasswordValidator.ValidateEasyReceivePassword(receipt, this.easyReceiveService)]
    );
    passwordPrompt.onDidDismiss((password: any) => {
      if (password) {
        // Got a password, let's go ahead and process the easy receipt again
        this.processEasyReceipt(receipt, password, processAll, wallet);
      }
    });
  }

  private async showConfirmEasyReceivePrompt(
    receipt: EasyReceipt,
    data: any,
    wallet?: MeritWalletClient,
    inviteOnly?: boolean
  ) {
    const amount = await this.easyReceiveService.getReceiverAmount(data.txs);

    let message;

    if (inviteOnly) {
      message =
        receipt.senderName.length > 0
          ? `@${receipt.senderName} invited you to join Merit!`
          : `You've been invited to join Merit!`;
    } else {
      message =
        receipt.senderName.length > 0
          ? `@${receipt.senderName} sent you ${amount} Merit!`
          : `You've got ${amount} Merit!`;
    }

    const confirmDialog = this.confirmDialogCtrl.create(message, 'Would you like to accept this transaction?', [
      {
        text: 'Yes',
        value: 'yes',
        class: 'primary',
      },
      {
        text: 'No',
        value: 'no',
      },
    ]);

    confirmDialog.onDidDismiss((val: string) => {
      if (val === 'yes') {
        // accepted
        this.acceptEasyReceipt(receipt, data, wallet);
      } else if (val === 'no') {
        // decline easy receive
        this.rejectEasyReceipt(receipt, data);
      }
    });
  }

  private async showCancelEasyReceivePrompt(
    receipt: EasyReceipt,
    data: any,
    wallet?: MeritWalletClient,
    cancelling?: boolean,
    inviteOnly?: boolean
  ) {
    const amount = await this.easyReceiveService.getReceiverAmount(data.txs);

    let title: string;

    if (inviteOnly) {
      title = 'Cancel MeritInvite link with 1 invite?';
    } else {
      title = `Cancel MeritMoney link with ${amount} Merit?`;
    }

    const confirmDialog = this.confirmDialogCtrl.create(
      title,
      `You clicked on a ${
        inviteOnly ? 'MeritInvite' : 'MeritMoney'
      } link that you created.  Would you like to cancel it?`,
      [
        {
          text: 'Cancel ' + (inviteOnly ? 'MeritInvite' : 'MeritMoney'),
          value: 'yes',
          class: 'primary',
        },
        {
          text: "Don't Cancel",
          value: 'no',
        },
      ]
    );

    confirmDialog.onDidDismiss((val: string) => {
      if (val === 'yes') {
        // accepted
        this.cancelEasyReceipt(receipt, wallet);
      } else if (val === 'no' && !cancelling) {
        // If value == 'no' && cancelling is false, that means that the user tried claiming his own MeritMoney
        // We shouldn't reject it on "no" since that will be the same thing as accepting it
        this.rejectEasyReceipt(receipt, data);
      }
    });
  }

  // TODO make wallet required
  private async cancelEasyReceipt(receipt: EasyReceipt, wallet?: MeritWalletClient): Promise<any> {
    try {
      wallet = wallet || (await this.profileService.getWallets())[0];
      if (!wallet) throw 'no wallet';

      const acceptanceTx = await this.easyReceiveService.cancelEasySendReceipt(wallet, receipt, '', '');

      this.logger.info('Cancelled easy send', acceptanceTx);
      this.store.dispatch(
        new RefreshOneWalletAction(wallet.id, {
          skipShareCode: true,
          skipRewards: true,
          skipAlias: true,
        })
      );
    } catch (err) {
      console.error(err);
      this.toastCtrl.error('There was an error cancelling your transaction.');
    }
  }

  private async acceptEasyReceipt(receipt: EasyReceipt, data: any, wallet?: MeritWalletClient): Promise<any> {
    try {
      wallet = wallet || (await this.profileService.getWallets())[0];
      if (!wallet) throw 'no wallet';

      const address = wallet.getRootAddress();
      const acceptanceTx = await this.easyReceiveService.acceptEasyReceipt(wallet, receipt, data, address.toString());

      this.logger.info('accepted easy send', acceptanceTx);
      this.store.dispatch(
        new RefreshOneWalletAction(wallet.id, {
          skipShareCode: true,
          skipRewards: true,
          skipAlias: true,
        })
      );
    } catch (err) {
      console.error(err);
      this.toastCtrl.error('There was an error retrieving your incoming payment.');
    }
  }

  private showSpentEasyReceiptAlert() {
    this.confirmDialogCtrl.create('Uh oh', 'It seems that the Merit from this link has already been redeemed!', [
      { text: 'Ok' },
    ]);
  }

  private showExpiredEasyReceiptAlert() {
    this.confirmDialogCtrl.create(
      'Transaction expired',
      'The Merit from this link has not been lost! You can ask the sender to make a new transaction.',
      [{ text: 'Ok' }]
    );
  }

  /**
   * Gets easyReceipt data from the blockchain and routes the ui accordingly
   * @param {EasyReceipt} receipt
   * @param {string} password
   * @param {boolean} processAll
   * @param {MeritWalletClient} wallet
   * @param {boolean} cancelling Set to true if the intention is to cancel the outgoing transaction
   * @returns {Promise<void>}
   */
  async processEasyReceipt(
    receipt: EasyReceipt,
    password?: string,
    processAll: boolean = true,
    wallet?: MeritWalletClient,
    cancelling?: boolean
  ): Promise<void> {
    password = password || '';
    const data = await this.easyReceiveService.validateEasyReceiptOnBlockchain(receipt, password);
    let txs = data.txs;

    if (!txs) return await this.easyReceiveService.deletePendingReceipt(receipt);

    if (!Array.isArray(txs)) {
      txs = [txs];
    }

    if (!txs.length) return this.showPasswordEasyReceivePrompt(receipt, processAll);

    const inviteOnly = !txs.some(tx => !tx.invite);

    //Decide if the wallet is the sender of the MeritMoney Link.
    //We will prompt here to cancel the MM Link instead.
    const senderPublicKey = new PublicKey(receipt.senderPublicKey);
    const senderAddress = senderPublicKey.toAddress(ENV.network).toString();
    const wallets = await this.profileService.getWallets();

    if (!wallet) {
      wallet =
        wallets.find((wallet: MeritWalletClient) => wallet.getRootAddress().toString() == senderAddress) || wallets[0];
    }

    const address = wallet.getRootAddress().toString();
    const isSender = senderAddress == address;

    if (txs.some(tx => tx.spent)) {
      this.logger.debug('Got a spent MeritMoney. Removing from pending receipts.');
      await this.easyReceiveService.deletePendingReceipt(receipt);

      if (receipt.scriptAddress && (await this.persistenceService2.cancelEasySend(receipt.scriptAddress))) {
        this.store.dispatch(new RefreshOneWalletTransactions(wallet.id));
      }

      await this.showSpentEasyReceiptAlert();

      if (cancelling) {
        const data = this.easyReceiveService.generateEasyScipt(receipt, password);
        const scriptAddress = this.easyReceiveService.getScriptAddress(data);
        this.persistenceService2
          .cancelEasySend(scriptAddress)
          .then(() => {
            this.store.dispatch(new RefreshOneWalletTransactions(wallet.id));
          })
          .catch(() => {});
      }

      return processAll ? await this.processPendingEasyReceipts() : null;
    }

    if (txs.some(tx => tx.confirmations === undefined)) {
      this.logger.warn('Got MeritMoney with unknown depth. It might be expired!');
      return isSender
        ? this.showCancelEasyReceivePrompt(receipt, data, wallet, cancelling, inviteOnly)
        : this.showConfirmEasyReceivePrompt(receipt, data, wallet, inviteOnly);
    }

    if (txs.some(tx => receipt.blockTimeout < tx.confirmations)) {
      this.logger.debug('Got an expired MeritMoney. Removing from pending receipts.');
      await this.easyReceiveService.deletePendingReceipt(receipt);
      await this.showExpiredEasyReceiptAlert();
      return processAll ? await this.processPendingEasyReceipts() : null;
    }

    return isSender
      ? this.showCancelEasyReceivePrompt(receipt, data, wallet, cancelling, inviteOnly)
      : this.showConfirmEasyReceivePrompt(receipt, data, wallet, inviteOnly);
  }

  /**
   * checks if pending easyreceive exists and if so, open it
   */
  private async processPendingEasyReceipts(): Promise<any> {
    const receipts = await this.easyReceiveService.getPendingReceipts();
    if (!receipts.length) return; // No receipts to process
    return this.processEasyReceipt(receipts[0]);
  }

  private async rejectEasyReceipt(receipt: EasyReceipt, data, wallet?: MeritWalletClient): Promise<any> {
    try {
      wallet = wallet || (await this.profileService.getWallets())[0];

      if (!wallet) throw 'Could not retrieve wallet';

      await this.easyReceiveService.rejectEasyReceipt(wallet, receipt, data);
      this.logger.info('MeritMoney rejected');
    } catch (err) {
      this.logger.error('Error rejecting MeritMoney', err);
      this.toastCtrl.error('There was an error rejecting the Merit');
    }
  }
}
