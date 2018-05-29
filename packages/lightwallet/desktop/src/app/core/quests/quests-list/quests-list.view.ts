import { Component, OnInit } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { Quests, Quest } from '@merit/common/models/quest';

@Component({
  selector: 'app-quests-list',
  templateUrl: './quests-list.view.html',
  styleUrls: ['./quests-list.view.sass'],
})
export class QuestsListView implements OnInit {
  constructor(private store: Store<IRootAppState>) {}

  questState$: Observable<Quests> = this.store.select('quests');

  ngOnInit() {}
  log(item) {
    console.log(item);
  }

  // quests$: Observable<Quest[]> = this.store.select(selectQuests);
}
