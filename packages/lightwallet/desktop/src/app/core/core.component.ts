import { Component, ViewEncapsulation } from '@angular/core';
import { PushNotificationsService } from '@merit/common/services/push-notification.service';

@Component({
  selector: 'view-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class CoreView {

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
      name: 'Community',
      icon: '/assets/v1/icons/ui/aside-navigation/network.svg',
      link: '/community'
    },
    {
      name: 'Settings',
      icon: '/assets/v1/icons/ui/aside-navigation/settings.svg',
      link: '/settings'
    }
  ];
  bottomMenuItems: any[] = [
    {
      name: 'Help & Support',
      icon: '/assets/v1/icons/ui/aside-navigation/info.svg',
      link: 'https://www.merit.me/get-involved/#join-the-conversation'
    }
  ];

  constructor(pushNotificationsService: PushNotificationsService) {}
}
