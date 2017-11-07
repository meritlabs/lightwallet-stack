import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultsView } from 'merit/vaults/vaults';


@NgModule({
  declarations: [
    VaultsView,
  ],
  providers: [
  ],
  imports: [
    IonicPageModule.forChild(VaultsView)
  ],
})
export class VaultsModule {}
  