import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendConfirmationView } from './send-confirmation';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    SendConfirmationView,
  ],
  imports: [
    IonicPageModule.forChild(SendConfirmationView),
    ComponentsModule
  ],
})
export class SendConfirmationModule {}
