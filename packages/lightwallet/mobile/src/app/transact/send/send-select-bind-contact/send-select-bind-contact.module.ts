import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendSelectBindContactView } from './send-select-bind-contact';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [SendSelectBindContactView],
  imports: [IonicPageModule.forChild(SendSelectBindContactView), ComponentsModule],
})
export class SendSelectBindContactModule {}
