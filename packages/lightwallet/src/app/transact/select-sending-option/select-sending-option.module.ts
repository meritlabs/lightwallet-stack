import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicPageModule } from 'ionic-angular';
import { SelectSendingOptionModal } from 'merit/transact/select-sending-option/select-sending-option';

@NgModule({
  declarations: [
    SelectSendingOptionModal,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(SelectSendingOptionModal),
  ],
})
export class SelectSendingOptionComponentModule {
}
