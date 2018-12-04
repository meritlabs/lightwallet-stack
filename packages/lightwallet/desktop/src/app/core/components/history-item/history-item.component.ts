import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IDisplayTransaction, TransactionAction } from '@merit/common/models/transaction';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { COINBASE_CONFIRMATION_THRESHOLD } from '@merit/common/utils/constants';
import { GlobalsendLinkPopupController } from '@merit/desktop/app/components/globalsend-link-popup/globalsend-link-popup.controller';

@Component({
  selector: 'history-item',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryItemComponent implements OnInit {
  @Input()
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

  constructor(private globalSendLinkCtrl: GlobalsendLinkPopupController, private easyReceive: EasyReceiveService) {}

  ngOnInit() {
    const { tx } = this;

    this.isConfirmed = tx.isCoinbase ? tx.isMature : true;
    this.isUnlockRequest = tx && tx.action === TransactionAction.UNLOCK;
    this.isCredit = tx.isCoinbase || tx.action === TransactionAction.RECEIVED || tx.isPoolReward;
    this.isInvite = tx.isInvite === true;
    this.isMiningReward = this.isReward && tx.outputs[0].index === 0;
    this.isEasySend = !this.isInvite && !this.isReward;
    if (tx.isCoinbase && !tx.isMature) {
      this.confirmationsExplanation =
        String(this.tx.confirmations) + ' block(s) confirmed from ' + COINBASE_CONFIRMATION_THRESHOLD;
    }

    if (tx.isGrowthReward) this.image = 'growth';
    else if (tx.isMiningReward) this.image = 'mining';
    else if (tx.isPoolReward) this.image = 'mining';
    else if (tx.isInvite) this.image = 'invite';
    else this.image = 'merit';
  }

  showMeritMoneyLink() {
    this.globalSendLinkCtrl.create(this.tx.easySendUrl);
  }

  async askCancelMeritMoney() {
    this.easyReceive.cancelEasySend(this.tx.easySendUrl);
  }
}
