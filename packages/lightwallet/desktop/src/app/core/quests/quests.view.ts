import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.view.html',
  styleUrls: ['./quests.view.sass'],
})
export class QuestsView implements OnInit {
  constructor() {}

  ngOnInit() {}

  quests: Object = [
    {
      name: 'Who I`m',
      shortDescription: `Find your wallet @alias.`,
      status: 'new',
      icon: '',
    },
    {
      name: 'BackUp rookie',
      shortDescription: `BackUp your wallet.`,
      status: 'new',
      icon: '',
    },
  ];
}
