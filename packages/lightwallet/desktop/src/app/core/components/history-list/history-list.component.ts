import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IDisplayTransaction } from '@merit/common/models/transaction';

@Component({
  selector: 'history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryListComponent {
  @Input() transactions: IDisplayTransaction[];
  @Input() loading: boolean;
  @Input() widget: boolean = false;
  activeIndex: number;

  toggleClass(i: number) {
    if (this.activeIndex !== i) {
      this.activeIndex = i;
    } else {
      this.activeIndex = null;
    }
  }
}
