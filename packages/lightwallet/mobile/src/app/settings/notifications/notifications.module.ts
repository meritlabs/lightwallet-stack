import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsView } from '@merit/mobile/app/settings/notifications/notifications';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [NotificationsView],
  imports: [IonicPageModule.forChild(NotificationsView), TranslateModule],
})
export class NotificationsViewModule {}
