import { NgModule } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { IonicPageModule } from 'ionic-angular';
import { NetworkView } from '@merit/mobile/app/community/network/network';
import { ClipModule } from 'ng2-clip';
import { CommonPipesModule } from '@merit/common/common-pipes.module';

@NgModule({
  declarations: [NetworkView],
  imports: [MomentModule, ClipModule, CommonPipesModule, IonicPageModule.forChild(NetworkView)],
})
export class NetworkViewModule {}
