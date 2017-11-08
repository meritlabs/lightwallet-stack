import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VaultsView } from 'merit/vaults/vaults';
import { VaultsService } from 'merit/vaults/vaults.service';


@NgModule({
  declarations: [
    VaultsView,
  ],
  providers: [
    VaultsService,
  ],
  imports: [
    IonicPageModule.forChild(VaultsView)
  ],
})
export class VaultsModule {}
  