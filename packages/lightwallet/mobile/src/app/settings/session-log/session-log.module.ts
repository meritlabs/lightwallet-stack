import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment/moment.module';
import { IonicPageModule } from 'ionic-angular';
import { ClipModule } from 'ng2-clip'
import { SessionLogView } from '@merit/mobile/app/settings/session-log/session-log';

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
