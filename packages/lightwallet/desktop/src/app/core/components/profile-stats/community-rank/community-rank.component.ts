import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-community-rank',
  templateUrl: './community-rank.component.html',
  styleUrls: ['./community-rank.component.sass'],
  animations: [
    trigger('showTips', [
      state('true', style({ maxHeight: '1000px', padding: '30px 20px' })),
      state('false', style({})),
      transition('* => *', animate('100ms ease-in-out')),
    ]),
  ],
})
export class CommunityRankComponent implements OnInit {
  constructor() {}

  @Output() close: EventEmitter<any> = new EventEmitter();

  @Input() active: boolean;

  ngOnInit() {}

  closePanel() {
    this.close.emit((this.active = false));
  }
}
