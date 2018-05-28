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
  ];
}
