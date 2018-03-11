import { Component, Input } from '@angular/core';
import { IDisplayTransaction } from '@merit/common/models/transaction';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.sass']
})
export class HistoryListComponent {
  @Input() limit: number;
  @Input() transactions: IDisplayTransaction[];
  @Input() loading: boolean;
  history: any = [
    {
      'name': 'mny89ri53nmfCvSp6jq90',
      'date': '18 Jan, 2018, 9:42AM',
      'value': 20,
      'type': 'regular'
    },
    {
      'name': 'Fred Ball',
      'date': '17 Jan, 10:42PM',
      'value': 15,
      'type': 'regular'
    },
    {
      'name': 'Mining Reward',
      'date': '22 Dec, 5:42PM',
      'value': 2,
      'type': 'mining'
    },
    {
      'name': 'Harriet Sandoval',
      'date': '18 Jan, 9:42AM',
      'value': -80,
      'type': 'regular'
    },
    {
      'name': 'Ambassador Reward',
      'date': '18 Jan, 9:42AM',
      'value': +8,
      'type': 'ambassador'
    },
    {
      'name': 'mny89ri53nmfCvSp6jq90',
      'date': '18 Jan, 2018, 9:42AM',
      'value': +20,
      'type': 'regular'
    }
  ];

  constructor() {
  }
}
