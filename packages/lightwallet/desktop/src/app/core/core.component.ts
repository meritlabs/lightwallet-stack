import { Component, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { EasyReceipt } from '@merit/common/models/easy-receipt';
import { IRootAppState } from '@merit/common/reducers';
import { RefreshOneWalletAction } from '@merit/common/reducers/wallets.reducer';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { LoggerService } from '@merit/common/services/logger.service';
import { ProfileService } from '@merit/common/services/profile.service';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';
import { PasswordValidator } from '@merit/common/validators/password.validator';
import { ConfirmDialogControllerService } from '@merit/desktop/app/components/confirm-dialog/confirm-dialog-controller.service';
import { PasswordPromptController } from '@merit/desktop/app/components/password-prompt/password-prompt.controller';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'view-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class CoreView {

  topMenuItems: any[] = [
    {
      name: 'Dashboard',
      icon: '/assets/v1/icons/ui/aside-navigation/home.svg',
      link: '/dashboard'
    },
    {
      name: 'Wallets',
      icon: '/assets/v1/icons/ui/aside-navigation/wallet.svg',
      link: '/wallets'
    },
    {
      name: 'Receive Merit',
      icon: '/assets/v1/icons/ui/aside-navigation/receive.svg',
      link: '/receive'
    },
    {
      name: 'Send Merit',
      icon: '/assets/v1/icons/ui/aside-navigation/send.svg',
      link: '/send'
    },
    {
      name: 'History',
      icon: '/assets/v1/icons/ui/aside-navigation/history.svg',
      link: '/history'
    },
    {
      name: 'Community',
      icon: '/assets/v1/icons/ui/aside-navigation/network.svg',
      link: '/community'
    },
    {
      name: 'Settings',
      icon: '/assets/v1/icons/ui/aside-navigation/settings.svg',
      link: '/settings'
    }
  ];
  bottomMenuItems: any[] = [
    {
      name: 'Help & Support',
      icon: '/assets/v1/icons/ui/aside-navigation/info.svg',
      link: 'https://www.merit.me/get-involved/#join-the-conversation'
    }
  ];

  constructor(pushNotificationsService: PushNotificationsService,
              private easyReceiveService: EasyReceiveService,
              private logger: LoggerService,
              private confirmDialogCtrl: ConfirmDialogControllerService,
              private passwordPromptCtrl: PasswordPromptController,
              private toastCtrl: ToastControllerService,
              private profileService: ProfileService,
              private store: Store<IRootAppState>) {}

  ngOnInit() {
    this.processPendingEasyReceipts();
  }

  private showPasswordEasyReceivePrompt(receipt: EasyReceipt) {
    const passwordPrompt = this.passwordPromptCtrl.create('Enter transaction password', [Validators.required], [PasswordValidator.ValidateEasyReceivePassword(receipt, this.easyReceiveService)]);
    passwordPrompt.onDismiss((password: any) => {
      if (password) {
        // Got a password, let's go ahead and process the easy receipt again
        this.processEasyReceipt(receipt, password);
      }
    });
  }

  private async showConfirmEasyReceivePrompt(receipt: EasyReceipt, data) {
    const amount = await this.easyReceiveService.getReceiverAmount(data.txs);
    const confirmDialog = this.confirmDialogCtrl.create(`You've got ${ amount } Merit!`, 'Would you like to accept this transaction?', [
      {
        text: 'Yes',
        value: 'yes',
        class: 'primary'
      },
      {
        text: 'No',
        value: 'no'
      }
    ]);

    confirmDialog.onDismiss((val: string) => {
      if (val === 'yes') {
        // accepted
        this.acceptEasyReceipt(receipt, data);
      } else if (val === 'no') {
        // decline easy receive
        this.rejectEasyReceipt(receipt, data);
      }
    });
  }

  private async acceptEasyReceipt(receipt: EasyReceipt, data: any): Promise<any> {
    try {
      const wallets = await this.profileService.getWallets();
      // TODO: Allow a user to choose which wallet to receive into.
      let wallet = wallets[0];
      if (!wallet) throw 'no wallet';

      const address = wallet.getRootAddress();
      const acceptanceTx = await this.easyReceiveService.acceptEasyReceipt(receipt, wallet, data, address.toString());

      this.logger.info('accepted easy send', acceptanceTx);
      this.store.dispatch(new RefreshOneWalletAction(wallet.id, {
        skipShareCode: true,
        skipRewards: true,
        skipAlias: true
      }));

    } catch (err) {
      console.log(err);
      this.toastCtrl.error('There was an error retrieving your incoming payment.');
    }
  }

  private showSpentEasyReceiptAlert() {
    this.confirmDialogCtrl.create('Uh oh', 'It seems that the Merit from this link has already been redeemed!', [{ text: 'Ok' }]);
  }

  private showExpiredEasyReceiptAlert() {
    this.confirmDialogCtrl.create('Transaction expired', 'The Merit from this link has not been lost! You can ask the sender to make a new transaction.', [{ text: 'Ok' }]);
  }

  /**
   * gets easyReceipt data from the blockchain and routes the ui accordingly
   */
  private async processEasyReceipt(receipt: EasyReceipt, password: string = ''): Promise<void> {
    const data = await this.easyReceiveService.validateEasyReceiptOnBlockchain(receipt, password);
    let txs = data.txs;

    if (!txs) return await this.easyReceiveService.deletePendingReceipt(receipt);

    if (!Array.isArray(txs)) {
      txs = [txs];
    }

    if (!txs.length) return this.showPasswordEasyReceivePrompt(receipt);

    if (txs.some(tx => tx.spent)) {
      this.logger.debug('Got a spent easyReceipt. Removing from pending receipts.');
      await this.easyReceiveService.deletePendingReceipt(receipt);
      await this.showSpentEasyReceiptAlert();
      return await this.processPendingEasyReceipts();
    }

    if (txs.some(tx => (tx.confirmations === undefined))) {
      this.logger.warn('Got easyReceipt with unknown depth. It might be expired!');
      return this.showConfirmEasyReceivePrompt(receipt, data);
    }

    if (txs.some(tx => receipt.blockTimeout < tx.confirmations)) {
      this.logger.debug('Got an expired easyReceipt. Removing from pending receipts.');
      await this.easyReceiveService.deletePendingReceipt(receipt);
      await this.showExpiredEasyReceiptAlert();
      return await this.processPendingEasyReceipts();
    }

    return this.showConfirmEasyReceivePrompt(receipt, data);
  }

  /**
   * checks if pending easyreceive exists and if so, open it
   */
  private async processPendingEasyReceipts(): Promise<any> {
    const receipts = await this.easyReceiveService.getPendingReceipts();
    if (!receipts.length) return; // No receipts to process
    return this.processEasyReceipt(receipts[0]);
  }

  private async rejectEasyReceipt(receipt: EasyReceipt, data): Promise<any> {
    try {
      const wallets = this.profileService.getWallets();
      const wallet = wallets[0];

      if (!wallet)
        throw 'Could not retrieve wallet';

      await this.easyReceiveService.rejectEasyReceipt(wallet, receipt, data);
      this.logger.info('GlobalSend rejected');
    } catch (err) {
      this.logger.error('Error rejecting GlobalSend', err);
      this.toastCtrl.error('There was an error rejecting the Merit');
    }
  }
}
