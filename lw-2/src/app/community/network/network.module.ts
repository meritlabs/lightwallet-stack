import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NetworkView } from './network';
import {MomentModule} from "angular2-moment/moment.module";

@NgModule({
  declarations: [
    NetworkView,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(NetworkView),
  ],
})
export class NetworkViewModule {}
