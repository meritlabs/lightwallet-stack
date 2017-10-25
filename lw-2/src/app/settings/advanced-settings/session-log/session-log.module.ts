import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SessionLogComponent } from './session-log';
import {MomentModule} from "angular2-moment/moment.module";

@NgModule({
  declarations: [
    SessionLogComponent,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(SessionLogComponent),
  ],
})
export class SessionLogComponentModule {}
