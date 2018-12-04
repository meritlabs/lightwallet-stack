import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EasySendShareView } from './easy-send-share';
import { ClipModule } from 'ng2-clip';

@NgModule({
  declarations: [EasySendShareView],
  imports: [IonicPageModule.forChild(EasySendShareView), ClipModule],
})
export class EasySendShareModule {}
