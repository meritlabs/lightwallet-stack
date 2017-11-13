import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SessionLogView } from 'merit/settings/advanced-settings/session-log/session-log';
import {MomentModule} from "angular2-moment/moment.module";

@NgModule({
  declarations: [
    SessionLogView,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(SessionLogView),
  ],
})
export class SessionLogComponentModule {}
