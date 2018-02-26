import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsView } from '@merit/mobile/app/settings/notifications/notifications';

@NgModule({
  declarations: [
    NotificationsView
  ],
  imports: [
    IonicPageModule.forChild(NotificationsView)
  ]
})
export class NotificationsViewModule {
}
