import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'view-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class HistoryComponent implements OnInit {
  history: any = [
    {
      "name": 'mny89ri53nmfCvSp6jq90',
      "date": '18 Jan, 2018, 9:42AM',
      "value": 20,
      "type": "regular"
    },
    {
      "name": 'Fred Ball',
      "date": '17 Jan, 10:42PM',
      "value": 15,
      "type": "regular"
    },
    {
      "name": 'Mining Reward',
      "date": '22 Dec, 5:42PM',
      "value": 2,
      "type": "mining"
    },
    {
      "name": 'Harriet Sandoval',
      "date": '18 Jan, 9:42AM',
      "value": -80,
      "type": "regular"
    },
    {
      "name": 'Ambassador Reward',
      "date": '18 Jan, 9:42AM',
      "value": +8,
      "type": "ambassador"
    },
    {
      "name": 'mny89ri53nmfCvSp6jq90',
      "date": '18 Jan, 2018, 9:42AM',
      "value": +20,
      "type": "regular"
    }
  ]
  constructor() {}
  ngOnInit() {}

}
