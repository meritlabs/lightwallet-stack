import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendView } from 'merit/transact/send/send';
import { SharedModule } from 'merit/shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    SendView,
  ],
  imports: [
    IonicPageModule.forChild(SendView),
    ComponentsModule
  ]
})
export class SendViewModule {
}
