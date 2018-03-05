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

  topMenuItems: any[] = [
    {
      name: 'Dashboard',
      icon: '/assets/v1/icons/ui/aside-navigation/home.svg',
      link: '/dashboard'
    },
    {
      name: 'Wallets',
      icon: '/assets/v1/icons/ui/aside-navigation/wallet.svg',
      link: '/wallets'
    },
    {
      name: 'Receive Merit',
      icon: '/assets/v1/icons/ui/aside-navigation/receive.svg',
      link: '/receive'
    },
    {
      name: 'Send Merit',
      icon: '/assets/v1/icons/ui/aside-navigation/send.svg',
      link: '/send'
    },
    {
      name: 'History',
      icon: '/assets/v1/icons/ui/aside-navigation/history.svg',
      link: '/history'
    },
    {
      name: 'Network',
      icon: '/assets/v1/icons/ui/aside-navigation/network.svg',
      link: '/network'
    },
    {
      name: 'Backup',
      icon: '/assets/v1/icons/ui/aside-navigation/backup.svg',
      link: '/backup'
    }
    // ,
    // {
    //   name: 'Community',
    //   icon: '/assets/v1/icons/ui/aside-navigation/info.svg',
    //   link: '/community'
    // }
  ];
  bottomMenuItems: any[] = [
    {
      name: 'Help & Support',
      icon: '/assets/v1/icons/ui/aside-navigation/info.svg',
      link: 'https://www.merit.me/'
    }
  ];
  constructor() { }

  onMenuItemClick(item: any) {

  }

}
