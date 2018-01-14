import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment/moment.module';
import { IonicPageModule } from 'ionic-angular';
import { SessionLogView } from 'merit/settings/advanced-settings/session-log/session-log';
import { ClipModule } from 'ng2-clip'

@NgModule({
  declarations: [
    SessionLogView,
  ],
  imports: [
    MomentModule,
    ClipModule,
    IonicPageModule.forChild(SessionLogView),
  ],
})
export class SessionLogComponentModule {
}
