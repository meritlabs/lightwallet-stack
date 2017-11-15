import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EasyReceiveView } from './easy-receive';
import {EasyReceiveService} from "merit/easy-receive/easy-receive.service";

@NgModule({
  declarations: [
    EasyReceiveView,
  ],
  providers: [
    EasyReceiveService
  ],
  imports: [
    IonicPageModule.forChild(EasyReceiveView),
  ],
})
export class EasyReceiveViewModule {}
