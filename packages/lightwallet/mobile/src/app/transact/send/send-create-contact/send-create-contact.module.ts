import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectivesModule } from '@merit/mobile/directives/directives.module';
import { SendCreateContactView } from './send-create-contact';

@NgModule({
  declarations: [SendCreateContactView],
  imports: [IonicPageModule.forChild(SendCreateContactView), DirectivesModule],
})
export class SendCreateContactModule {}
