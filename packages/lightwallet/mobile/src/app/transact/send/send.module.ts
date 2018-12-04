import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendView } from '@merit/mobile/app/transact/send/send';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [SendView],
  imports: [IonicPageModule.forChild(SendView), ComponentsModule],
})
export class SendViewModule {}
