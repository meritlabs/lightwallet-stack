import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { NetworkComponent } from './network';
import {MomentModule} from "angular2-moment/moment.module";

@NgModule({
  declarations: [
    NetworkComponent,
  ],
  imports: [
    MomentModule,
    IonicComponentModule.forChild(NetworkComponent),
  ],
})
export class NetworkComponentModule {}
