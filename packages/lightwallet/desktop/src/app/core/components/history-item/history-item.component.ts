import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IDisplayTransaction, TransactionAction } from '@merit/common/models/transaction';
import { EasyReceiveService } from '@merit/common/services/easy-receive.service';
import { COINBASE_CONFIRMATION_THRESHOLD } from '@merit/common/utils/constants';
import { GlobalsendLinkPopupController } from '@merit/desktop/app/components/globalsend-link-popup/globalsend-link-popup.controller';

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
      return Boolean(this.tx.isCoinbase) && this.tx.outputs[0] && !isNaN(this.tx.outputs[0].n) && !this.tx.isInvite;
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

    this.isConfirmed = tx.isCoinbase ? tx.confirmations > 101 : true;
    this.isUnlockRequest = tx.action === TransactionAction.UNLOCK;
    this.isCredit = tx.type === 'credit';

    switch (tx.action) {
      case TransactionAction.AMBASSADOR_REWARD:
        this.image = 'growth';
        tx.name = 'Growth Reward';
        break;

      case TransactionAction.INVITE:
        this.image = 'invite';
        tx.name = tx.isCoinbase? 'Mined invite' : tx.name;
        break;

      case TransactionAction.MINING_REWARD:
        this.image = tx.isInvite? 'invite' : 'mining';
        tx.name = tx.isInvite? 'Mined invite' : 'Mining reward';
        break;

      case TransactionAction.POOL_REWARD:
        this.image = 'mining';
        tx.name = 'Pool reward';
        break;
    }
  }

  showMeritMoneyLink() {
    this.globalSendLinkCtrl.create(this.tx.easySendUrl);
  }

  async askCancelMeritMoney() {
    this.easyReceive.cancelEasySend(this.tx.easySendUrl);
  }
}
