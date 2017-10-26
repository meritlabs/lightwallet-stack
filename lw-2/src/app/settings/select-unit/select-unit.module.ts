import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectUnitModal } from '@app/settings/select-unit/select-unit';

@NgModule({
  declarations: [
    SelectUnitModal,
  ],
  imports: [
    IonicPageModule.forChild(SelectUnitModal),
  ],
})
export class SelectUnitComponentModule {}
