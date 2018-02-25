import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendCreateContactView } from './send-create-contact';

@NgModule({
  declarations: [
    SendCreateContactView,
  ],
  imports: [
    IonicPageModule.forChild(SendCreateContactView),
  ],
})
export class SendCreateContactModule {
}
