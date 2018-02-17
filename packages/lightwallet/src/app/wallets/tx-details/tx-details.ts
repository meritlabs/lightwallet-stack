import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { CONFIRMATION_THRESHOLD } from '../../../utils/constants';
import { IDisplayTransaction, TransactionAction } from '../../../models/transaction';

@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'tx-details-view',
  templateUrl: 'tx-details.html'
})
export class TxDetailsView {

  tx: IDisplayTransaction;
  confirmations: string;
  isUnlockRequest: boolean;
  isCredit: boolean;
  isInvite: boolean;
  isMiningReward: boolean;
  isEasySend: boolean;
  isConfirmed: boolean;
  image: string = 'merit';

  get isReward() {
    try {
      return Boolean(this.tx.isCoinbase) && this.tx.outputs[0] && !isNaN(this.tx.outputs[0].index);
    } catch (e) {
      return false;
    }
  }

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController) {}

  dismiss() {
    return this.viewCtrl.dismiss();
  }

  async ngOnInit() {
    this.tx = this.navParams.get('tx');
    this.isConfirmed = (this.tx.isCoinbase && this.tx.isMature) || this.tx.confirmations >= CONFIRMATION_THRESHOLD;
    this.isUnlockRequest = this.tx && this.tx.action === TransactionAction.UNLOCK;
    this.isCredit = this.tx.action === TransactionAction.RECEIVED;
    this.isInvite = this.tx.isInvite === true;
    this.isMiningReward = this.isReward && this.tx.outputs[0].index === 0;
    this.isEasySend = !this.isInvite && !this.isReward;
    this.confirmations = this.tx.safeConfirmed || (this.tx.confirmations > CONFIRMATION_THRESHOLD) ?  `${CONFIRMATION_THRESHOLD}+ confirmations` : String(this.tx.confirmations) + ' block(s) confirmed from ' + CONFIRMATION_THRESHOLD;

    if (!this.isEasySend) {
      if (this.tx.isAmbassadorReward) this.image = 'ambassador';
      else if (this.tx.isMiningReward) this.image = 'mining';
      else if (this.tx.isInvite) this.image = 'invite';
      else this.image = 'merit';
    }
  }
}
