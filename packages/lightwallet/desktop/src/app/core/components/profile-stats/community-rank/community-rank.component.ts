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

  private _wallets: any[];
  private _ranks: any;

  @Output()
  close: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  onMoreSecurityRewards: Function;
  @Input()
  onMoreCommunity: Function;
  @Input()
  active: boolean;
  @Input()
  leaderboard: any[];
  @Input()
  rankData: any;
  @Input()
  set ranks(val: any[]) {
    this._ranks = val;
    this.assignRanks();
  }

  get ranks(): any[] {
    return this._ranks;
  }

  @Input()
  set wallets(val: DisplayWallet[]) {
    this._wallets = val;
    this.assignRanks();
  }

  get wallets(): DisplayWallet[] {
    return this._wallets;
  }

  closePanel() {
    this.active = false;
    this.close.emit();
  }

  private assignRanks() {
    if (!this._ranks || !this._wallets) return;

    this._wallets.map(w => {
      w.rank = this.ranks.find(r => r.address == w.referrerAddress);
    });
  }
}
