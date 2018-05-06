import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { IDisplayTransaction } from '@merit/common/models/transaction';

@Component({
  selector: 'history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class HistoryListComponent {
  @Input() transactions: IDisplayTransaction[];
  @Input() loading: boolean;
  @Input() widget: boolean;

  viewPortItems: IDisplayTransaction[];
}
