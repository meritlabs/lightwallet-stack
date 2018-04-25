import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { getEasySendURL } from '@merit/common/models/easy-send';
import { IDisplayTransaction, TransactionAction } from '@merit/common/models/transaction';
import { COINBASE_CONFIRMATION_THRESHOLD } from '@merit/common/utils/constants';
import { GlobalsendLinkPopupController } from '@merit/desktop/app/components/globalsend-link-popup/globalsend-link-popup.controller';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';

@Component({
  selector: 'history-item',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryItemComponent implements OnInit {
  @Input() tx: IDisplayTransaction;

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

  constructor(
    private globalSendLinkCtrl: GlobalsendLinkPopupController,
    private easyReceive: EasyReceiveService
  ) {}

  ngOnInit() {
    const { tx } = this;

    this.isConfirmed = tx.isCoinbase ? tx.isMature : true;
    this.isUnlockRequest = tx && tx.action === TransactionAction.UNLOCK;
    this.isCredit = tx.isCoinbase || tx.action === TransactionAction.RECEIVED;
    this.isInvite = tx.isInvite === true;
    this.isMiningReward = this.isReward && tx.outputs[0].index === 0;
    this.isEasySend = !this.isInvite && !this.isReward;
    if (!tx.isConfirmed) {
      this.confirmationsExplanation = String(this.tx.confirmations) + ' block(s) confirmed from ' + COINBASE_CONFIRMATION_THRESHOLD;
    }

    if (tx.isAmbassadorReward) this.image = 'ambassador';
    else if (tx.isMiningReward) this.image = 'mining';
    else if (tx.isInvite) this.image = 'invite';
    else this.image = 'merit';
  }

  showGlobalSendLink() {
    this.globalSendLinkCtrl.create(this.tx.easySendUrl);
  }

  async askCancelGlobalSend() {
    const globalSendUrl = this.tx.easySendUrl;

    //TODO Ask user for these things
    const walletPassword = "";
    const password = "";

    this.easyReceive.cancelEasySend(
      this.tx.wallet,
      globalSendUrl,
      password,
      walletPassword);
  }
}
