import { Component, ViewEncapsulation } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WalletsComponent } from './wallets/wallets.component';
import { ReceiveComponent } from './receive/receive.component';

@Component({
  selector: 'view-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CoreComponent {

  menuItems: any[] = [
    {
      name: 'Dashboard',
      icon: '/assets/icons/icon_home.png',
      link: '/dashboard'
    },
    {
      name: 'Wallets',
      icon: '/assets/icons/icon_wallet.png',
      link: '/wallets'
    },
    {
      name: 'Receive Merit',
      icon: '/assets/icons/icon_receive.png',
      link: '/receive'
    },
    {
      name: 'Send Merit',
      icon: '/assets/icons/icon_send.png',
      link: '/send'
    },
    {
      name: 'History',
      icon: '/assets/icons/icon_history.png',
      link: '/history'
    },
    {
      name: 'Community',
      icon: '/assets/icons/icon_history.png',
      link: '/community'
    }
  ];

  constructor() { }

  onMenuItemClick(item: any) {

  }

}
