import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NetworkView } from '@app/community/network/network';
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
