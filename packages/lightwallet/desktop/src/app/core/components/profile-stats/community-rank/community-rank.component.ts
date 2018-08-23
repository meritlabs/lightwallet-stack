import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DisplayWallet } from '@merit/common/models/display-wallet';

@Component({
  selector: 'app-community-rank',
  templateUrl: './community-rank.component.html',
  styleUrls: ['./community-rank.component.sass'],
  animations: [
    trigger('showTips', [
      state('true', style({ maxHeight: '1000px', padding: '30px 20px' })),
      state('false', style({})),
      transition('* => *', animate('100ms cubic-bezier(0.445, 0.05, 0.55, 0.95)')),
    ]),
  ],
})
export class CommunityRankComponent {
  constructor() {}

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() onCommunity: EventEmitter<void> = new EventEmitter<void>();
  @Output() onMining: EventEmitter<void> = new EventEmitter<void>();

  @Input() onMoreSecurityRewards: Function;
  @Input() onMoreCommunity: Function;
  @Input() active: boolean;
  @Input() leaderboard: any[];
  @Input() rankData: any;
  @Input()
  wallets: DisplayWallet[];

  closePanel() {
    this.active = false;
    this.close.emit();
  }
}
