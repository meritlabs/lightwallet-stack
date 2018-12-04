import { NgModule } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { IonicPageModule } from 'ionic-angular';
import { ClipModule } from 'ng2-clip';
import { SessionLogView } from '@merit/mobile/app/settings/session-log/session-log';

@NgModule({
  declarations: [SessionLogView],
  imports: [MomentModule, ClipModule, IonicPageModule.forChild(SessionLogView)],
})
export class SessionLogComponentModule {}
