import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncomingRequestModal } from './incoming-request';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [IncomingRequestModal],
  imports: [MomentModule, IonicPageModule.forChild(IncomingRequestModal)],
})
export class IncomingRequestModule {}
