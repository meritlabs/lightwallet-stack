import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NetworkComponent } from './network';
import {MomentModule} from "angular2-moment/moment.module";

@NgModule({
  declarations: [
    NetworkComponent,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(NetworkComponent),
  ],
})
export class NetworkComponentModule {}
