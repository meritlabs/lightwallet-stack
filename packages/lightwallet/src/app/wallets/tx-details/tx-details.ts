import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { CONFIRMATION_THRESHOLD } from '../../../utils/constants';
import { IDisplayTransaction } from '../../../models/transaction';

@IonicPage({
  defaultHistory: ['WalletsView']
})
@Component({
  selector: 'tx-details-view',
  templateUrl: 'tx-details.html'
})
export class TxDetailsView {

  wallet: any;
  tx: IDisplayTransaction;
  confirmations: string;
  vault: any;
  amountStr: string;

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController) {
    this.tx = this.navParams.get('tx');
  }

  dismiss() {
    return this.viewCtrl.dismiss();
  }

  async ngOnInit() {
    this.updateTxDetails(this.tx);
  }

  addMemo() {
    return;
  }

  public isNotConfirmed(tx: any): boolean {
    return (tx.isCoinbase && !tx.isMature) || tx.confirmations < 1;
  }

  private updateTxDetails(tx: IDisplayTransaction): void {
    if (tx.safeConfirmed) this.confirmations = tx.safeConfirmed;
    else if (tx.confirmations > CONFIRMATION_THRESHOLD) this.confirmations = `${CONFIRMATION_THRESHOLD}+`;

    this.tx = tx;
  }
}
