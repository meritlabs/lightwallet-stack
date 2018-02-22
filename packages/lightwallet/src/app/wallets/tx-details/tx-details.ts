import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { COINBASE_CONFIRMATION_THRESHOLD } from '../../../utils/constants';
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
  confirmationsExplanation: string;
  isUnlockRequest: boolean;
  isCredit: boolean;
  isInvite: boolean;
  isMiningReward: boolean;
  isEasySend: boolean;
  isConfirmed: boolean;
  image: string = 'merit';

  get isReward() {
    try {
      return Boolean(this.tx.isCoinbase) && this.tx.outputs[0] && !isNaN(this.tx.outputs[0].index) && !this.tx.isInvite;
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
    const tx = this.navParams.get('tx');

    this.isConfirmed = tx.isCoinbase ? tx.isMature : true;
    this.isUnlockRequest = tx && tx.action === TransactionAction.UNLOCK;
    this.isCredit = tx.isCoinbase || tx.action === TransactionAction.RECEIVED;
    this.isInvite = tx.isInvite === true;
    this.isMiningReward = this.isReward && tx.outputs[0].index === 0;
    this.isEasySend = !this.isInvite && !this.isReward;
    if (!tx.isConfirmed) {
      this.confirmationsExplanation = String(tx.confirmations) + ' block(s) confirmed from ' + COINBASE_CONFIRMATION_THRESHOLD;
    }

    if (tx.isAmbassadorReward) this.image = 'ambassador';
    else if (tx.isMiningReward) this.image = 'mining';
    else if (tx.isInvite) this.image = 'invite';
    else this.image = 'merit';

    console.dir(this);

    this.tx = tx;
  }
}
