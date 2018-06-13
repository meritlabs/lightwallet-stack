import { Component } from '@angular/core';
import { DisplayWallet } from '@merit/common/models/display-wallet';
import { IRootAppState } from '@merit/common/reducers';
import { RefreshOneWalletTransactions } from '@merit/common/reducers/transactions.reducer';
import {
  selectInviteRequests,
  selectInvites,
  selectWalletsWithInvites,
  UpdateInviteRequestsAction
} from '@merit/common/reducers/wallets.reducer';
import { LoggerService } from '@merit/common/services/logger.service';
import { IUnlockRequest } from '@merit/common/services/unlock-request.service';
import { WalletService } from '@merit/common/services/wallet.service';
import { ConfirmDialogControllerService } from '@merit/desktop/app/components/confirm-dialog/confirm-dialog-controller.service';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

@Component({
  selector: 'view-invite-requests',
  templateUrl: './invite-requests.view.html',
  styleUrls: ['./invite-requests.view.sass']
})
export class InviteRequestsView {
  inviteRequests$: Observable<IUnlockRequest[]> = this.store.select(selectInviteRequests);
  availableInvites$: Observable<number> = this.store.select(selectInvites);
  wallets$: Observable<DisplayWallet[]> = this.store.select(selectWalletsWithInvites);

  sending: { [referralId: string]: boolean } = {};

  constructor(private store: Store<IRootAppState>,
              private confirmDialogCtrl: ConfirmDialogControllerService,
              private logger: LoggerService,
              private toastCtrl: ToastControllerService,
              private walletService: WalletService) {}

  async approveRequest(request: IUnlockRequest) {
    const availableInvites = await this.availableInvites$.pipe(take(1)).toPromise();

    if (availableInvites === 0) {
      this.toastCtrl.error('You do not have any available invites to send.');
      return;
    }

    const dialog = this.confirmDialogCtrl.create('Confirm action', 'Are you sure you would like to send an invite to this address?', [
      {
        text: 'Yes',
        value: 'yes',
        class: 'primary'
      },
      {
        text: 'No'
      }
    ]);

    dialog.onDidDismiss(async (value: string) => {
      if (value === 'yes') {
        this.sending[request.referralId] = true;
        try {
          let wallet = request.walletClient;
          const availableInvites = wallet.invitesBalance;

          if (availableInvites === 0) {
            const wallets = await this.wallets$.pipe(take(1)).toPromise();
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
          const remainingRequests = (await this.inviteRequests$.pipe(take(1)).toPromise()).filter((r: IUnlockRequest) => r.address !== request.address);
          this.store.dispatch(new UpdateInviteRequestsAction(remainingRequests));
        } catch (err) {
          this.logger.error('Error sending invite', err);
          this.toastCtrl.error(err.message ? err.message : 'An error occurred while sending an invite.');
        }

        this.sending[request.referralId] = false;
      }
    });
  }
}
