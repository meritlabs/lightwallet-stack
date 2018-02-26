import { Component, ViewEncapsulation } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WalletsComponent } from './wallets/wallets.component';
import { ReceiveComponent } from './receive/receive.component';

@Component({
  selector: 'view-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class CoreComponent {

  menuItems: any[] = [
    {
      name: 'Dashboard',
      icon: '/assets/v1/icons/ui/aside-navigation/home.svg',
      link: '/dashboard'
    },
    {
      name: 'Wallets',
      icon: '',
      link: '/wallets'
    },
    {
      name: 'Receive Merit',
      icon: '',
      link: '/receive'
    },
    {
      name: 'Send Merit',
      icon: '',
      link: '/send'
    },
    {
      name: 'History',
      icon: '',
      link: '/history'
    },
    {
      name: 'Community',
      icon: '',
      link: '/community'
    }
  ];

  constructor() { }

  onMenuItemClick(item: any) {

  }

}
