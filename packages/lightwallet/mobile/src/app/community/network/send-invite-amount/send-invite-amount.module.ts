import { NgModule } from '@angular/core';
import { IonicPageModule} from 'ionic-angular';
import { SendInviteAmountView } from '@merit/mobile/app/community/network/send-invite-amount/send-invite-amount';
import { ComponentsModule } from '@merit/mobile/components/components.module';

@NgModule({
  declarations: [
    SendInviteAmountView,
  ],
  imports: [
    IonicPageModule.forChild(SendInviteAmountView),
    ComponentsModule
  ]
})
export class SendInviteAmountViewModule { }
