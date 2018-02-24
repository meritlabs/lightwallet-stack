import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendInviteView } from 'merit/community/network/send-invite/send-invite';
import { SharedModule } from 'merit/shared/shared.module';
import { ComponentsModule } from 'merit/../components/components.module';

@NgModule({
  declarations: [
    SendInviteView,
  ],
  imports: [
    IonicPageModule.forChild(SendInviteView),
    ComponentsModule
  ]
})
export class SendInviteViewModule {
}
