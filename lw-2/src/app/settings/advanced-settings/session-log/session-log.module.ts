import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { SessionLogComponent } from './session-log';
import {MomentModule} from "angular2-moment/moment.module";

@NgModule({
  declarations: [
    SessionLogComponent,
  ],
  imports: [
    MomentModule,
    IonicComponentModule.forChild(SessionLogComponent),
  ],
})
export class SessionLogComponentModule {}
