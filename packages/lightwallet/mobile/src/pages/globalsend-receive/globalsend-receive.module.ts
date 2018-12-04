import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GlobalsendReceiveView } from './globalsend-receive';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [GlobalsendReceiveView],
  imports: [IonicPageModule.forChild(GlobalsendReceiveView), CommonPipesModule],
})
export class GlobalsendReceiveModule {}
