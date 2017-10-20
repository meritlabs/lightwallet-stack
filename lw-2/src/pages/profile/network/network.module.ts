import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NetworkPage } from './network';
import {MomentModule} from "angular2-moment/moment.module";

@NgModule({
  declarations: [
    NetworkPage,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(NetworkPage),
  ],
})
export class NetworkPageModule {}
