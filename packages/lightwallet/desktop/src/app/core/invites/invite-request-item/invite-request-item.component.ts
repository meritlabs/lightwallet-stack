import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { RefreshOneWalletTransactions } from '@merit/common/reducers/transactions.reducer';
import { LoggerService } from '@merit/common/services/logger.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { ConfirmDialogControllerService } from '@merit/desktop/app/components/confirm-dialog/confirm-dialog-controller.service';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { Store } from '@ngrx/store';
import { InviteRequest } from '@merit/common/services/invite-request.service';

@Component({
  selector: 'invite-request-item',
  templateUrl: './invite-request-item.component.html',
  styleUrls: ['./invite-request-item.component.sass'],
  host: { class: 'invite-request-list' },
})
export class InviteRequestItemComponent {
  @Input() request: InviteRequest;
  @Input() availableInvites: number;
  @Input() wallets: DisplayWallet[];
  @Output() remove: EventEmitter<void> = new EventEmitter<void>();

  sending: boolean;

  constructor(
    private store: Store<IRootAppState>,
    private confirmDialogCtrl: ConfirmDialogControllerService,
    private logger: LoggerService,
    private toastCtrl: ToastControllerService,
    private walletService: WalletService,
  ) {
  }

  async approveRequest() {
    const dialog = this.confirmDialogCtrl.create(
      'Send Invite Token',
      'Are you sure you would like to send an invite to this address?',
      [
        {
          text: 'Yes',
          value: 'yes',
          class: 'primary',
        },
        {
          text: 'No',
        },
      ],
    );

    dialog.onDidDismiss(async (value: string) => {
      if (value === 'yes') {
        this.sending = true;
        try {
          let wallet: DisplayWallet;

          if (this.wallets.length > 1) {
            // Show wallet selector

          } else {
            wallet = this.wallets[0];
          }


          await this.walletService.sendInvite(wallet.client, this.request.address);

          this.store.dispatch(new RefreshOneWalletTransactions(wallet.id));
          this.remove.emit();
          this.toastCtrl.success('The invite request has been confirmed.');
        } catch (err) {
          this.logger.error('Error sending invite', err);
          this.toastCtrl.error(err.message ? err.message : 'An error occurred while sending an invite.');
        } finally {
          this.sending = false;
        }
      }
    });
  }

  ignoreRequest() {
    const dialog = this.confirmDialogCtrl.create(
      'Ignore Invite Request',
      'Are you sure you would like to ignore this invite request?',
      [
        {
          text: 'Yes',
          value: 'yes',
          class: 'primary',
        },
        {
          text: 'No',
        },
      ],
    );

    dialog.onDidDismiss(async (value: string) => {
      if (value === 'yes') {
        await this.request.ignore();
        this.remove.emit();
      }
    });
  }
}
