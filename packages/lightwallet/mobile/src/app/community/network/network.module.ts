import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment/moment.module';
import { IonicPageModule } from 'ionic-angular';
import { NetworkView } from '@merit/mobile/app/community/network/network';
import { ClipModule } from 'ng2-clip'

@NgModule({
  declarations: [
    NetworkView,
  ],
  imports: [
    MomentModule,
    ClipModule,
    IonicPageModule.forChild(NetworkView),
  ]
})
export class NetworkViewModule {
}
