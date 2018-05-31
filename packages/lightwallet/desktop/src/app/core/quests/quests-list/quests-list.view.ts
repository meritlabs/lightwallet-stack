import { Component, OnInit } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { Quests, Quest } from '@merit/common/models/quest';
import { QuestsService } from '@merit/common/services/quests.service';

@Component({
  selector: 'app-quests-list',
  templateUrl: './quests-list.view.html',
  styleUrls: ['./quests-list.view.sass'],
})
export class QuestsListView implements OnInit {
  constructor(private store: Store<IRootAppState>, private service: QuestsService) {}

  questState$: Observable<Quests> = this.store.select('quests');

  ngOnInit() {
    this.service.loadQuests();
  }
  log(item) {
    console.log(item);
  }
}
