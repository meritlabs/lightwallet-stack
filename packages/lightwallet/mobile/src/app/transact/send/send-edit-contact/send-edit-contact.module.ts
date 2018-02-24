import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendEditContactView } from './send-edit-contact';

@NgModule({
  declarations: [
    SendEditContactView,
  ],
  imports: [
    IonicPageModule.forChild(SendEditContactView),
  ],
})
export class SendEditContactModule {}
