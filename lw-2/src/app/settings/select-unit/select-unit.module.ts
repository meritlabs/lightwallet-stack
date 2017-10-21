import { NgModule } from '@angular/core';
import { IonicComponentModule } from 'ionic-angular';
import { SelectUnitModal } from './select-unit';

@NgModule({
  declarations: [
    SelectUnitModal,
  ],
  imports: [
    IonicComponentModule.forChild(SelectUnitModal),
  ],
})
export class SelectUnitComponentModule {}
