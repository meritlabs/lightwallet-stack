import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';
import { SendEditContactView } from './send-edit-contact';

@NgModule({
  declarations: [SendEditContactView],
  imports: [IonicPageModule.forChild(SendEditContactView), DirectivesModule],
})
export class SendEditContactModule {}
