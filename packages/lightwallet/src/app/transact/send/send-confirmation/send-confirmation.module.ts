import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendConfirmationView } from './send-confirmation';

@NgModule({
  declarations: [
    SendConfirmationView,
  ],
  imports: [
    IonicPageModule.forChild(SendConfirmationView),
  ],
})
export class SendConfirmationModule {}
