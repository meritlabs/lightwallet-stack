import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendConfirmationView } from './send-confirmation';
import { ComponentsModule } from '../../../../components/components.module';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [SendConfirmationView],
  imports: [IonicPageModule.forChild(SendConfirmationView), ComponentsModule, CommonPipesModule],
})
export class SendConfirmationModule {}
