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

  tx: IDisplayTransaction;
  confirmationsExplanation: string;
  isUnlockRequest: boolean;
  isCredit: boolean;
  isInvite: boolean;
  isMiningReward: boolean;
  isEasySend: boolean;
  isCancelled: boolean;
  isConfirmed: boolean;
  image: string = 'merit';

  get isReward() {
    try {
      return Boolean(this.tx.isCoinbase) && this.tx.outputs[0] && !isNaN(this.tx.outputs[0].n) && !this.tx.isInvite;
    } catch (e) {
      return false;
    }
  }

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
    this.tx.cancelled = true;
    this.isCancelled = true;
    return this.viewCtrl.dismiss();
  }

  async ngOnInit() {
    const tx = this.navParams.get('tx');

    this.isConfirmed = tx.isCoinbase ? tx.isMature : true;
    this.isUnlockRequest = tx && tx.action === TransactionAction.UNLOCK;
    this.isCredit = tx.isCoinbase || tx.action === TransactionAction.RECEIVED;
    this.isInvite = tx.isInvite === true;
    this.isMiningReward = this.isReward && tx.outputs[0].n === 0;
    this.isEasySend = !this.isInvite && !this.isReward;
    this.isCancelled = tx.cancelled;
    if (!tx.isConfirmed) {
      this.confirmationsExplanation = String(tx.confirmations) + ' block(s) confirmed from ' + COINBASE_CONFIRMATION_THRESHOLD;
    }

    if (tx.isGrowthReward) this.image = 'growth';
    else if (tx.isMiningReward) this.image = 'mining';
    else if (tx.isInvite) this.image = 'invite';
    else this.image = 'merit';

    this.tx = tx;
  }
}
