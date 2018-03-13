import { Component, Input } from '@angular/core';

@Component({
  selector: 'history-item',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.sass']
})
export class HistoryItemComponent {
  @Input() item: any;
  @Input() activeIndex: number;
  @Input() index: number;
}
