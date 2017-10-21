import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SessionLogPage } from './session-log';
import {MomentModule} from "angular2-moment/moment.module";

@NgModule({
  declarations: [
    SessionLogPage,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(SessionLogPage),
  ],
})
export class SessionLogPageModule {}
