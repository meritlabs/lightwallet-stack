import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsView } from '@merit/mobile/app/settings/notifications/notifications';
import { SharedModule } from '@merit/mobile/app/shared/shared.module';


// This module manaages the sending of money.
// This is the first of three steps.
@NgModule({
  declarations: [
    NotificationsView
  ],
  imports: [
    IonicPageModule.forChild(NotificationsView),
    SharedModule
  ]
})
export class NotificationsViewModule {
}
