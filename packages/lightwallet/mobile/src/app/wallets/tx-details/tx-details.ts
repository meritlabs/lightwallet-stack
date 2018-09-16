import { Component } from '@angular/core';
import { IDisplayTransaction, TransactionAction } from '@merit/common/models/transaction';
import { ToastControllerService } from '@merit/common/services/toast-controller.service';
import { COINBASE_CONFIRMATION_THRESHOLD } from '@merit/common/utils/constants';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';

@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'tx-details-view',
  templateUrl: 'tx-details.html'
})
export class TxDetailsView {

  tx: IDisplayTransaction = this.navParams.get('tx');
  confirmationsExplanation: string;

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController,
              private toastCtrl: ToastControllerService,
              private easyReceive: EasyReceiveService) {
  }

  dismiss() {
    return this.viewCtrl.dismiss();
  }

  onMeritMoneyCopy() {
    this.toastCtrl.success('Copied to clipboard');
  }

  cancelMeritMoney() {
    this.easyReceive.cancelEasySend(this.tx.easySendUrl);
    this.tx.easySend.cancelled = true;
    return this.viewCtrl.dismiss();
  }
}
