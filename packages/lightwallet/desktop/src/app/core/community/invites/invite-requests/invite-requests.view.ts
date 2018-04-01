import { Component } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { RefreshOneWalletTransactions, UpdateOneWalletTransactions } from '@merit/common/reducers/transactions.reducer';
import { selectInviteRequests, UpdateInviteRequestsAction } from '@merit/common/reducers/wallets.reducer';
import { LoggerService } from '@merit/common/services/logger.service';
import { IUnlockRequest, UnlockRequestService } from '@merit/common/services/unlock-request.service';
import { ConfirmDialogControllerService } from '@merit/desktop/app/components/confirm-dialog/confirm-dialog-controller.service';
import { ToastControllerService } from '@merit/desktop/app/components/toast-notification/toast-controller.service';
import { Store } from '@ngrx/store';
import { ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

@Component({
  selector: 'view-invite-requests',
  templateUrl: './invite-requests.view.html',
  styleUrls: ['./invite-requests.view.scss']
})
export class InviteRequestsView {
  inviteRequests$: Observable<IUnlockRequest[]> = this.store.select(selectInviteRequests);

  constructor(private store: Store<IRootAppState>,
              private confirmDialogCtrl: ConfirmDialogControllerService,
              private logger: LoggerService,
              private toastCtrl: ToastControllerService) {}

  approveRequest(request: IUnlockRequest) {
    const dialog = this.confirmDialogCtrl.create('Confirm action', 'Are you sure you would like to send an invite to this address?', [
      {
        text: 'Yes',
        value: 'yes'
      },
      {
        text: 'No',
        value: 'no'
      }
    ]);

    dialog.onDismiss(async (value: string) => {
      if (value === 'yes') {
        try {
          await request.walletClient.sendInvite(request.address);
          this.store.dispatch(new RefreshOneWalletTransactions(request.walletClient.id));

          this.toastCtrl.success('The invite request has been confirmed.');
          const remainingRequests = (await this.inviteRequests$.pipe(take(1)).toPromise()).filter((r: IUnlockRequest) => r.address !== request.address);
          this.store.dispatch(new UpdateInviteRequestsAction(remainingRequests));
        } catch (err) {
          this.logger.error('Error sending invite', err);
          this.toastCtrl.error('An error occurred while sending an invite.');
        }
      }
    });
  }
}
