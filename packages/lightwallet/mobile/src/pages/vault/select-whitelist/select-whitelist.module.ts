import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicPageModule } from 'ionic-angular';
import { SelectWhitelistModal } from './select-whitelist';
import { CommonPipesModule } from '@merit/common/common-pipes.module';


@NgModule({
  declarations: [
    SelectWhitelistModal,
  ],
  imports: [
    MomentModule,
    CommonPipesModule,
    IonicPageModule.forChild(SelectWhitelistModal),
  ],
})
export class SelectWhitelistComponentModule {}
