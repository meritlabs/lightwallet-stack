import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { RefreshOneWalletTransactions } from '@merit/common/reducers/transactions.reducer';
import { IgnoreInviteRequestAction, UpdateInviteRequestsAction } from '@merit/common/reducers/wallets.reducer';
import { LoggerService } from '@merit/common/services/logger.service';
import { IUnlockRequest } from '@merit/common/services/unlock-request.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { ConfirmDialogControllerService } from '@merit/desktop/app/components/confirm-dialog/confirm-dialog-controller.service';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-pending-invite-item',
  templateUrl: './pending-invite-item.component.html',
  styleUrls: ['./pending-invite-item.component.sass'],
  host: { class: 'invite-request-list' },
})
export class PendingInviteItemComponent {
  constructor(
    private store: Store<IRootAppState>,
    private confirmDialogCtrl: ConfirmDialogControllerService,
    private logger: LoggerService,
    private toastCtrl: ToastControllerService,
    private walletService: WalletService,
  ) {}

  @Input()
  request;
  @Input()
  availableInvites;
  @Input()
  inviteRequests;
  @Input()
  wallets;

  @Output()
  approveInviteRequest: EventEmitter<boolean> = new EventEmitter<boolean>();

  sending: { [referralId: string]: boolean } = {};

  async approveRequest(request: IUnlockRequest) {
    const availableInvites = this.availableInvites[0];

    if (availableInvites === 0) {
      this.toastCtrl.error('You do not have any available invites to send.');
      return;
    }

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
        this.approveInviteRequest.emit(true);
        this.sending[request.referralId] = true;
        try {
          let wallet = request.walletClient;
          const availableInvites = wallet.invitesBalance;

          if (availableInvites === 0) {
            const wallets = this.wallets[0];
            const walletWithInvite = wallets.find((w: DisplayWallet) => w.client.invitesBalance > 0);

            if (walletWithInvite) {
              wallet = request.walletClient = walletWithInvite.client;
            } else {
              this.toastCtrl.error('You do not have any invites to send.');
              return;
            }
          }

          await this.walletService.sendInvite(wallet, request.address);

          this.store.dispatch(new RefreshOneWalletTransactions(wallet.id));
          this.toastCtrl.success('The invite request has been confirmed.');
          const remainingRequests = this.inviteRequests.filter((r: IUnlockRequest) => r.address !== request.address);
          this.store.dispatch(new UpdateInviteRequestsAction(remainingRequests));
        } catch (err) {
          this.logger.error('Error sending invite', err);
          this.toastCtrl.error(err.message ? err.message : 'An error occurred while sending an invite.');
        }

        this.sending[request.referralId] = false;
      }
    });
  }
  ignoreRequest(request: IUnlockRequest) {
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
        this.store.dispatch(new IgnoreInviteRequestAction(request.address));
      }
    });
  }
}
