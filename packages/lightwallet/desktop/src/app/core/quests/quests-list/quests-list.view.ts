import { Component, OnInit } from '@angular/core';
import { IRootAppState } from '@merit/common/reducers';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { Quests } from '@merit/common/models/quest';
import { selectQuests } from '@merit/common/reducers/quests.reducer';

@Component({
  selector: 'app-quests-list',
  templateUrl: './quests-list.view.html',
  styleUrls: ['./quests-list.view.sass'],
})
export class QuestsListView implements OnInit {
  constructor(private store: Store<IRootAppState>) {}

  ngOnInit() {}

  quests$: Observable<Quests[]> = this.store.select(selectQuests);

  quests: Object = [
    {
      name: 'Who I`m',
      shortDescription: `Find your wallet @alias.`,
      status: 'compleate',
      icon: '/assets/v1/icons/award.svg',
    },
    {
      name: 'BackUp rookie',
      shortDescription: `BackUp your wallet.`,
      status: 'in progress',
      icon: '/assets/v1/icons/award.svg',
    },
    {
      name: 'Setup expret',
      shortDescription: `Setup your LightWallet flow`,
      status: 'new',
      icon: '/assets/v1/icons/award.svg',
    },
    {
      name: 'Spread master',
      shortDescription: `Share Merit and increase your rating`,
      status: 'new',
      icon: '/assets/v1/icons/award.svg',
      path: 'spread-master',
    },
  ];
}
