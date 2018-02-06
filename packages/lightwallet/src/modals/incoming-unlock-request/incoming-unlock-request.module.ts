import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncomingUnlockRequestModal } from './incoming-unlock-request';
import { SharedModule } from 'merit/shared/shared.module';

@NgModule({
  declarations: [
    IncomingUnlockRequestModal,
  ],
  imports: [
    IonicPageModule.forChild(IncomingUnlockRequestModal),
    SharedModule
  ],
})
export class IncomingUnlockRequestModalModule {}
