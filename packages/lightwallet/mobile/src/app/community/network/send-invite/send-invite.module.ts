import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendInviteView } from '@merit/mobile/app/community/network/send-invite/send-invite';
import { ComponentsModule } from '@merit/mobile/components/components.module';

@NgModule({
  declarations: [SendInviteView],
  imports: [IonicPageModule.forChild(SendInviteView), ComponentsModule],
})
export class SendInviteViewModule {}
