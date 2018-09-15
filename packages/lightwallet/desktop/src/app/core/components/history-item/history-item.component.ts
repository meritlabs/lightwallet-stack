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

  constructor(
    private globalSendLinkCtrl: GlobalsendLinkPopupController,
    private easyReceive: EasyReceiveService
  ) {}

  showMeritMoneyLink() {
    this.globalSendLinkCtrl.create(this.tx.easySendUrl);
  }

  async askCancelMeritMoney() {
    this.easyReceive.cancelEasySend(this.tx.easySendUrl);
  }
}
