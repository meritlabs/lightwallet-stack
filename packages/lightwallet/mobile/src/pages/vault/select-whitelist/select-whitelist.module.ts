import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicPageModule } from 'ionic-angular';
import { SelectWhitelistModal } from './select-whitelist';

@NgModule({
  declarations: [
    SelectWhitelistModal,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(SelectWhitelistModal),
  ],
})
export class SelectWhitelistComponentModule {}
